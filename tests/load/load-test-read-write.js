import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
  scenarios: {
    // Heavy readers — simulates your typical API traffic
    readers: {
      executor: 'constant-vus',
      vus: 50,
      duration: '2m',
      exec: 'readFlow',
    },
    // Concurrent writers — puts pressure on the primary
    writers: {
      executor: 'constant-arrival-rate',
      rate: 10,              // 10 creates/second
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 20,
      exec: 'writeFlow',
    },
  },
  thresholds: {
    // Track read latency specifically
    'http_req_duration{scenario:readers}': ['p(95)<300', 'p(99)<500'],
    'http_req_duration{scenario:writers}': ['p(95)<1000'],
  },
}

export function readFlow() {
  const res = http.get('http://localhost:4000/api/products')
  check(res, { 'read 200': (r) => r.status === 200 })
  sleep(0.2)
}

export function writeFlow() {
  const res = http.post(
    'http://localhost:4000/api/products',
    JSON.stringify({
      name: `Load Test Product ${__VU}_${__ITER}_${Date.now()}`,
      tagline: 'A tagline for load testing purposes only',
      websiteUrl: 'https://example.com',
      launchDate: new Date().toISOString(),
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
  check(res, { 'write 201': (r) => r.status === 201 })
}
