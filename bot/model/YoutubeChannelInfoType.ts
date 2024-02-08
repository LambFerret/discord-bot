export type YoutubeChannelInfoType = {
    id: string,
    channelTitle: string,
    description: string,
    url: string,
    thumbnail: string,
    isLive : boolean,
}

/*
ON

{
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 1
  },
  "items": [
    {
      "snippet": {
        "publishedAt": "2011-03-22T03:58:14Z",
        "channelId": "UCaKod3X1Tn4c7Ci0iUKcvzQ",
        "title": "런닝맨 - 스브스 공식 채널",
        "description": "SBS Running Man은 SBS [런닝맨] 공식 예능 스튜디오 입니다. 런닝맨에서 나왔던 화제있는 장면을 모아 구성한 [예능맛ZIP], 그리고 ...",
        "thumbnails": {
          "default": {
            "url": "https://yt3.ggpht.com/w_-LFDAZ6IuoN2cAETzjXALif41WE9uv0SxWQyViV1vb1xb7TJ51o8GBqg_1tl6tXm9DaDpKmw=s88-c-k-c0xffffffff-no-rj-mo"
          }
        },
        "channelTitle": "런닝맨 - 스브스 공식 채널",
        "liveBroadcastContent": "live",
      }
    }
  ]
}


OFF

{
  "pageInfo": {
    "totalResults": 1,
    "resultsPerPage": 1
  },
  "items": [
    {
      "snippet": {
        "publishedAt": "2020-06-05T09:51:27Z",
        "channelId": "UCC1LvVTX2ySKYjeIXkAtvsQ",
        "title": "침착맨 플러스",
        "description": "침착맨의 게임 및 뒷고기 영상이 올라갑니다.",
        "thumbnails": {
          "default": {
            "url": "https://yt3.ggpht.com/vVYuVT-7NtG5BIXA7Y0VPWdkjIom1dr6XEgI1GoQ6JvbTgpKk1n6RgalRHO6bubt4fsHMSd9XtE=s88-c-k-c0xffffffff-no-rj-mo"
          },
        },
        "channelTitle": "침착맨 플러스",
        "liveBroadcastContent": "none",
      }
    }
  ]
}
    
    */