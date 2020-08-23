import axios from 'axios';

import { serve } from '../src/index';
import { ExampleApplication } from './example-application';

describe('Application controller', () => {
  const server = serve(ExampleApplication, 8080);
  const url = 'http://localhost:8080/articles';

  afterAll(() => {
    server.close();
  });

  it('should execute GET request and return 200 status', async () => {
    const {status, data} = await axios.get(url);

    expect(status).toBe(200);
    expect(data).toBe('get');
  });

  it('should execute POST request and return 200 status', async () => {
    const {status, data} = await axios.post(url);

    expect(status).toBe(200);
    expect(data).toBe('post');
  });

  it('should execute PUT request and return 200 status', async () => {
    const {status, data} = await axios.put(url);

    expect(status).toBe(200);
    expect(data).toBe('put');
  });

  it('should execute PATCH request and return 200 status', async () => {
    const {status, data} = await axios.patch(url);

    expect(status).toBe(200);
    expect(data).toBe('patch');
  });

  it('should execute DELETE request and return 200 status', async () => {
    const {status, data} = await axios.delete(url);

    expect(status).toBe(200);
    expect(data).toBe('delete');
  });

  it('should execute OPTIONS request and return 200 status', async () => {
    const {status, data} = await axios.options(url);

    expect(status).toBe(200);
    expect(data).toBe('options');
  });
});