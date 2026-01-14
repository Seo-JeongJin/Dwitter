export default class TweetService {
  async getTweets(username) {
    const query = username ? `?username=${username}` : '';
    const response = await fetch(`http://localhost:8080/tweets/${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message);
    }
    return data;
  }

  async postTweet(text) {
    const response = await fetch(`http://localhost:8080/tweets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, username: 'ellie', name: 'Ellie' }),
    });
    const data = await response.json();
    if (response.status !== 201) {
      throw new Error(data.message);
    }
    return data;
  }

  async deleteTweet(tweetId) {
    const response = await fetch(`http://localhost:8080/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status !== 204) {
      throw new Error();
    }
  }

  async updateTweet(tweetId, text) {
    const response = await fetch(`http://localhost:8080/tweets/${tweetId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message);
    }
    return data;
  }
}
