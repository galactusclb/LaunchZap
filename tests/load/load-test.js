import http from 'k6/http'
import { sleep, check } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // ramp up to 50 concurrent users
    { duration: '1m',  target: 50 },   // hold
    { duration: '15s', target: 0  },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
  },
}

export default function () {
  const res = http.get('http://localhost:4000/api/products')
  check(res, { 'status 200': (r) => r.status === 200 })
  sleep(0.5)
}
