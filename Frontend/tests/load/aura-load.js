import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 25,
  duration: '1m',
};

export default function () {
  const res = http.get('http://localhost:3000/api/aura/conversations');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
