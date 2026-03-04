export default class TweetService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  // 트윗 목록을 조회
  async getTweets(username) {
    // username이 전달되었다면 '?username=xxx' 쿼리를 붙이고, 아니라면 빈 문자열로 둬서 전체를 조회하게 만듦
    const query = username ? `?username=${username}` : '';
    return this.http.fetch(`/tweets${query}`, {
      method: 'GET',
      headers: this.getHeaders(), // 아래에 만든 공통 함수를 호출해 토큰 헤더를 자동으로 붙여줌
    });
  }

  // 새 트윗을 작성
  async postTweet(text) {
    return this.http.fetch(`/tweets`, {
      method: 'POST',
      headers: this.getHeaders(), // 인증된 사용자만 글을 쓸 수 있도록 토큰 첨부!
      // ⚠️ 주의: 현재 username과 name이 'ellie', 'Ellie'로 하드코딩 되어 있습니다!
      // 서버 구조상 백엔드에서 토큰(req.userId)을 기반으로 작성자를 파악하므로 작동에는 문제가 없겠지만,
      // 깔끔한 관리를 위해 body: JSON.stringify({ text }) 로만 보내도록 수정하시는 것을 추천합니다.
      body: JSON.stringify({ text, username: 'ellie', name: 'Ellie' }),
    });
  }

  // 특정 트윗을 삭제
  async deleteTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: this.getHeaders(), // 내 글이 맞는지 백엔드에서 확인할 수 있도록 토큰을 보냄
    });
  }

  // 특정 트윗을 수정
  async updateTweet(tweetId, text) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }), // 바꿀 텍스트 내용을 바디에 담아 보냄
    });
  }

  // 클래스 내부에서 공통으로 사용할 헤더 생성 헬퍼 함수
  getHeaders() {
    const token = this.tokenStorage.getToken(); // 토큰 저장소에서 토큰을 꺼내와서
    return {
      Authorization: `Bearer ${token}`, // Authorization 헤더 객체를 만들어 반환
    };
  }
}
