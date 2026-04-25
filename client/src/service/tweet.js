export default class TweetService {
  constructor(http, tokenStorage, socket) {
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.socket = socket;
  }

  async getTweets(username, channel, limit = 20, offset = 0) {
    const params = new URLSearchParams({ limit, offset });
    if (username) params.append('username', username);
    if (channel) params.append('channel', channel);
    return this.http.fetch(`/tweets?${params.toString()}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  async postTweet(text, channel = 'general') {
    return this.http.fetch(`/tweets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text, channel }),
    });
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async updateTweet(tweetId, text) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
  }

  async getBookmarks(limit = 20, offset = 0) {
    const params = new URLSearchParams({ limit, offset });
    return this.http.fetch(`/tweets/bookmarks?${params.toString()}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  async bookmarkTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}/bookmarks`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async unbookmarkTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}/bookmarks`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async likeTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}/likes`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async unlikeTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}/likes`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  onSync(callback) {
    return this.socket.onSync('tweets', callback);
  }
}
