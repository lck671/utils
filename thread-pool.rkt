#lang racket/base

(require racket/match
         racket/async-channel
         net/http-client)

(define urls '(["icanhazip.com" "/"]
               ["icanhazepoch.com" "/"]
               ["example.com" "/"]))

(define (main)
  (define p (new-pool 4))

  (displayln "Sending thunks")
  (for ([url urls])
    (match-let ([(list host path) url])
      (pool-put p (λ ()
                    (match-let-values ([(status _ port) (http-sendrecv host path)])
                                      (displayln status)
                                      (port-count-chars port))))))

  (displayln "Reading results")
  (for ([_ urls])
    (displayln (pool-get p)))

  (pool-close p))

(struct pool (in-ch out-ch threads))

(define (new-pool number-of-threads [out-ch-limit #f])
  (define in-ch (make-channel))
  (define out-ch (make-async-channel out-ch-limit))
  (define threads (for/list ([_ (in-range number-of-threads)])
    (thread (λ ()
              (define (get) (channel-get in-ch))
              (define (put smth) (async-channel-put out-ch smth))
              (let loop ([thunk (get)])
                (unless (eq? thunk 'close)
                  (put (thunk))
                  (loop (get))))))))
  (pool in-ch out-ch threads))

(define (pool-put pool thunk)
  (channel-put (pool-in-ch pool) thunk))

(define (pool-get pool)
  (async-channel-get (pool-out-ch pool)))

(define (pool-close pool)
  (define in-ch (pool-in-ch pool))
  (define threads (pool-threads pool))
  (for-each (λ (_) (channel-put in-ch 'close)) threads)
  (for-each thread-wait threads))

(define (port-count-chars input-port)
  (define (read) (read-char input-port))
  (let loop ([char (read)]
             [result 0])
    (if (eof-object? char)
      result
      (loop (read) (add1 result)))))

(module+ test
  (require rackunit)
  (check-equal? (port-count-chars (open-input-string "abcdefg")) 7))

(module+ main
  (main))
