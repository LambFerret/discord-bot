export type LiveChzzkInfoType = {
    channelId: string;
    channelName: string;
    channelImageUrl: string;
    liveStatus: boolean;
    liveImageUrl: string;
    liveTitle: string;
}

/*
  ON 의 경우
{
    "content": {
        "liveId": 4248657,
        "liveTitle": "용과같이 8  엔딩까지  스포주의",
        "status": "OPEN",
        "liveImageUrl": null,
        "defaultThumbnailImageUrl": null,
        "openDate": "2024-01-29 21:26:06",
        "adult": true,
        "chatChannelId": "N13saf",
        "categoryType": "GAME",
        "liveCategory": "Like_a_Dragon_Infinite_Wealth",
        "liveCategoryValue": "용과 같이 8",
         "channel": {
            "channelId": "7ce8032370ac5121dcabce7bad375ced",
            "channelName": "풍월량월풍월량",
            "channelImageUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMjBfNzgg/MDAxNzAyOTk5MDU4NTQ1.q74UANafs4egu_GflqIXrKZvqweabjdsqb3q7F-vEPEg.0DlZf3Myopu6ITUmTkOYLU-GKcBLotgKn61A0o9ZAN4g.PNG/7d354ef2-b2a8-4276-8c12-5be7f6301ae0-profile_image-600x600.png",
            "verifiedMark": false
        },
    }
}

    OFF 의 경우
{
    "content": {
      "liveId": 4246954,
      "liveTitle": "제목을 입력하세요",
      "status": "CLOSE",
      "liveImageUrl": null,
      "defaultThumbnailImageUrl": null,
      "openDate": "2024-01-29 16:50:14",
      "adult": true,
      "chatChannelId": "N13sAn",
      "categoryType": null,
      "liveCategory": "",
      "liveCategoryValue": "",
      "channel": {
        "channelId": "17aa057a8248b53affe30512a91481f5",
        "channelName": "김도 KimDoe",
        "channelImageUrl": "https://nng-phinf.pstatic.net/MjAyMzEyMDdfMjA5/MDAxNzAxODc1Mzk0Njgz.4jdg2LkiZM_r-GCnzaLv89BkTh-sWLdYjuYcf_t3IP4g.KhoU7pv7Vk5K4QPKX361Cv7VblSE4LXV5NwjgWETEGkg.PNG/%ED%94%84%EC%82%AC.png",
        "verifiedMark": false
      },
    }
  }

  */