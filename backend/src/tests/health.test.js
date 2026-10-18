import test from 'node:test';import assert from 'node:assert/strict';import app from '../app.js';import request from 'supertest';
test('health endpoint responds with standard success envelope',async()=>{const res=await request(app).get('/api/v1/health');assert.equal(res.status,200);assert.equal(res.body.success,true);assert.equal(res.body.data.status,'ok');});
test('unknown route returns 404 JSON',async()=>{const res=await request(app).get('/api/v1/does-not-exist');assert.equal(res.status,404);assert.equal(res.body.success,false);});
