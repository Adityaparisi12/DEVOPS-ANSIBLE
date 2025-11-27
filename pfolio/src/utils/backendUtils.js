import axios from 'axios';
import config from '../config';

/**
 * Wake up the hosted backend by making a ping request
 * This is useful for free hosting services that go to sleep
 */
export const wakeUpBackend = async () => {
  try {
    console.log('Waking up hosted backend...');
    await axios.get(`${config.url}/health`, { 
      timeout: 30000,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    console.log('Backend is awake');
    return true;
  } catch (error) {
    console.log('Backend wake-up failed or no health endpoint:', error.message);
    // Don't throw error - this is just a wake-up attempt
    return false;
  }
};

/**
 * Make a request with automatic backend wake-up retry
 */
export const makeRequestWithWakeup = async (requestFn, maxRetries = 1) => {
  try {
    return await requestFn();
  } catch (error) {
    if (error.code === 'ECONNABORTED' && maxRetries > 0) {
      console.log('Request timed out, attempting to wake up backend...');
      await wakeUpBackend();
      
      // Wait a bit more for the backend to fully start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Retry the original request
      return await makeRequestWithWakeup(requestFn, maxRetries - 1);
    }
    throw error;
  }
};

/**
 * Check if we're using a hosted backend (not localhost)
 */
export const isHostedBackend = () => {
  return !config.url.includes('localhost') && !config.url.includes('127.0.0.1');
};