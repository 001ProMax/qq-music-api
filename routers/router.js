const Router = require('koa-router');
const router = new Router();
const { lyricParse } = require('../util/lyricParse');
const { _guid } = require('../module/config');
const apis = require('../module/index');

// downloadQQMusic
router.get('/downloadQQMusic', async (ctx, next) => {
  let params = Object.assign({
    format: 'jsonp',
    jsonpCallback: 'MusicJsonCallback',
    platform: 'yqq',
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };

  await apis.downloadQQMusic(props).then((res) => {
    let response = res.data;
    if (typeof response === 'string') {
      let reg = /^\w+\(({[^()]+})\)$/;
      let matches = response.match(reg);
      if (matches) {
        response = JSON.parse(matches[1]);
      }
    }
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

router.get('/getHotkey', async (ctx, next) => {
  let params = Object.assign({
    format: 'json',
    hostUin: 0,
    needNewCode: 0
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.getHotKey(props).then((res) => {
    let response = res.data;
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// w：搜索关键字
// p：当前页
// n：每页歌曲数量
// catZhida: 0表示歌曲, 2表示歌手, 3表示专辑, 4, 5
router.get('/getSearchByKey/:key?/:limit?/:page?/:catZhida?', async (ctx, next) => {
  let w = ctx.query.key;
  let n = +ctx.query.limit || 10;
  let p = +ctx.query.page || 1;
  let catZhida = +ctx.query.catZhida || 1;
  let params = Object.assign({
    format: 'json',
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.song',
    // searchid: 58932895599763136,
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida,
    lossless: 0,
    flag_qc: 0,
    p: 1,
    n,
    w,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (w) {
    await apis.getSearchByKey(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'search key is null',
    }
  }
});

// search smartbox
router.get('/getSmartbox/:key?', async (ctx, next) => {
  let key = ctx.query.key;
  let params = Object.assign({
    format: 'json',
    is_xml: 0,
    key,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (key) {
    await apis.getSmartbox(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 200;
    ctx.body = {
      response: null,
    }
  }
});

/**
 * @description: 歌单
 * 1 歌单类型
 * 2 所有歌单
 * 3 分类歌单
 * 4 歌单详情
 *
 */
// 1
router.get('/getSongListCategories', async (ctx, next) => {
  let params = Object.assign({
    format: 'json',
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.songListCategories(props).then((res) => {
    let response = res.data;
    if (typeof response === 'string') {
      let reg = /^\w+\(({[^()]+})\)$/;
      let matches = response.match(reg);
      if (matches) {
        response = JSON.parse(matches[1]);
      }
    }
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

/**
 * @description: 2, 3
 * @param {page} 页数
 * @param {limit} 每页条数[20, 60]
 * @param {categoryId} 分类
 * @param {sortId} 分类
 * @return: 
 */
router.get('/getSongLists/:page?/:limit?/:categoryId?/:sortId?', async (ctx, next) => {
  let ein = ctx.query.limit || 19;
  let sin = ctx.query.page || 0;
  let sortId = ctx.query.sortId || 5;
  let categoryId = ctx.query.categoryId || 10000000;
  let params = Object.assign({
    format: 'json',
    picmid: 1,
    categoryId,
    sortId,
    sin,
    ein,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.songLists(props).then((res) => {
    let response = res.data;
    if (typeof response === 'string') {
      let reg = /^\w+\(({[^()]+})\)$/;
      let matches = response.match(reg);
      if (matches) {
        response = JSON.parse(matches[1]);
      }
    }
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// 4
// disstid=7011264340
router.get('/getSongListDetail/:disstid?', async (ctx, next) => {
  let disstid = ctx.query.disstid;
  let params = Object.assign({
    format: 'json',
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.songListDetail(props).then((res) => {
    let response = res.data;
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// newDisk
router.get('/getNewDisks/:page?/:limit?', async (ctx, next) => {
  let page = +ctx.query.page || 1;
  let num = +ctx.query.limit || 20;
  let start = (page - 1) * num;
  let data = {
    new_album: {
      module: 'newalbum.NewAlbumServer',
      method: 'get_new_album_info',
      param: {
        area: 1,
        start,
        num,
      }
    },
    comm: {
      ct: 24,
      cv: 0
    }
  }
  if (!start) {
    data.new_album_tag = {
      module: 'newalbum.NewAlbumServer',
      method: 'get_new_album_area',
      param: {}
    };
  }
  let params = Object.assign({
    format: 'json',
    data: JSON.stringify(data),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.UCommon(props).then((res) => {
    let response = res.data;
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// getMvByTag
router.get('/getMvByTag', async (ctx, next) => {
  let params = Object.assign({
    format: 'json',
    outCharset: 'GB2312',
    cmd: 'shoubo',
    lan: 'all',
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.getMvByTag(props).then((res) => {
    let response = res.data;
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// MV
// area_id=15&version_id=7
router.get('/getMv/:area_id?/:version_id?/:limit?/:page?', async (ctx, next) => {
  let area_id = +ctx.query.area_id;
  let version_id = +ctx.query.version_id;
  let size = +ctx.query.limit || 20;
  let start = (ctx.query.page - 1 || 0) * size;
  let data = {
    comm: {
      ct: 24
    },
    mv_tag: {
      module: 'MvService.MvInfoProServer',
      method: 'GetAllocTag',
      param: {}
    },
    mv_list: {
      module: 'MvService.MvInfoProServer',
      method: 'GetAllocMvInfo',
      param: {
        start,
        size,
        version_id,
        area_id,
        order: 1
      }
    }
}
  let params = Object.assign({
    format: 'json',
    data: JSON.stringify(data),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (version_id && area_id) {
    await apis.UCommon(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'version_id or area_id is null',
    }
  }
});


// getSimilarSinger
// singermid=0025NhlN2yWrP4
router.get('/getSimilarSinger/:singermid?', async (ctx, next) => {
  let singer_mid = ctx.query.singermid;
  let params = Object.assign({
    format: 'json',
    utf8: 1,
    singer_mid,
    start: 0,
    num: 5,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (singer_mid) {
    await apis.getSimilarSinger(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no singermid',
    }
  }
});

// getSingerAlbum
// singermid=0025NhlN2yWrP4
router.get('/getSingerAlbum/:singermid?/:limit?/:page?', async (ctx, next) => {
  let singermid = ctx.query.singermid;
  let num = +ctx.query.limit || 5;
  let sin = ctx.query.page || 0;
  let data = {
    comm: {
      ct: 24,
      cv: 0
    },
    singer: {
      method: 'get_singer_detail_info',
      param: {
        sort: 5,
        singermid,
        sin,
        num,
      },
      module: 'music.web_singer_info_svr',
    }
  };
  let params = Object.assign({
    format: 'json',
    singermid,
    data: JSON.stringify(data),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (singermid) {
    await apis.UCommon(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no singermid',
    }
  }
});

/**
 * @description: getSingerMv
 * @param order: time(fan upload) || listen(singer all)
 */
router.get('/getSingerMv/:singermid?/:limit?/:order?', async (ctx, next) => {
  let singermid = ctx.query.singermid;
  let order = ctx.query.order;
  let num = ctx.query.limit || 5;
  let params = Object.assign({
    format: 'json',
    cid: 205360581,
    singermid,
    order,
    begin: 0,
    num,
  });
  if (order && order.toLowerCase() === 'time') {
    params = Object.assign(params, {
      cmd: 1,
    })
  }
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (singermid) {
    await apis.getSingerMv(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no singermid',
    }
  }
});

router.get('/getSingerDesc/:singermid?', async (ctx, next) => {
  let singermid = ctx.query.singermid;
  let params = Object.assign({
    format: 'xml',
    singermid,
    utf8: 1,
    outCharset: 'utf-8',
    r: new Date().getTime(),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (singermid) {
    await apis.getSingerDesc(props).then((res) => {
      let response = JSON.stringify(res.data);
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no singermid',
    }
  }
});

router.get('/getSingerStarNum/:singermid?', async (ctx, next) => {
  let singermid = ctx.query.singermid;
  let params = Object.assign({
    format: 'json',
    singermid,
    utf8: 1,
    rnd: new Date().getTime(),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (singermid) {
    await apis.getSingerStarNum(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no singermid',
    }
  }
});

// radio
router.get('/getRadioLists', async (ctx, next) => {
  let params = Object.assign({
    format: 'json',
    channel: 'radio',
    page: 'index',
    tpl: 'wk',
    new: 1,
    p: Math.round(1),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.getRadioLists(props).then((res) => {
    let response = res.data;
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// DigitalAlbum
router.get('/getDigitalAlbumLists', async (ctx, next) => {
  let params = Object.assign( {
    format: 'json',
    cmd: 'pc_index_new',
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.getDigitalAlbumLists(props).then((res) => {
    let response = res.data;
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// music
// getLyric
// songmid=003rJSwm3TechU
router.get('/getLyric/:songmid?/:isFormat?', async (ctx, next) => {
  let songmid = ctx.query.songmid;
  let isFormat = ctx.query.isFormat || false;
  let params = Object.assign({
    format: 'json',
    pcachetime: new Date().getTime(),
    songmid,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (songmid) {
    await apis.getLyric(props).then((res) => {
      let lyricString = res.data && res.data.lyric &&
        new Buffer.from(res.data.lyric, 'base64').toString();
      let lyric = isFormat ? lyricParse(lyricString) : lyricString;
      let response = {
        ...res.data,
        lyric,
      };
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no songmid',
    }
  }
});

// songmid=003rJSwm3TechU
router.get('/getMusicVKey/:songmid?', async (ctx, next) => {
  let songmid = ctx.query.songmid + '';
  let guid = _guid ? _guid + '' : '1429839143';
  // let data = {
  //   req: {
  //     module: "CDN.SrfCdnDispatchServer",
  //     method: "GetCdnDispatch",
  //     param: {
  //       guid,
  //       calltype: 0,
  //       userip: ""
  //     }
  //   },
  //   req_0: {
  //     module: 'vkey.GetVkeyServer',
  //     method: 'CgiGetVkey',
  //     param: {
  //       guid,
  //       songmid: [songmid],
  //       songtype: [0],
  //       uin: 0,
  //       loginflag: 1,
  //       platform: 20
  //     }
  //   },
  //   comm: {
  //     uin: 0,
  //     format: 'json',
  //     ct: 24,
  //     cv: 0
  //   }
  // };
  let data = `{"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"${guid}","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"${guid}","songmid":["${songmid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}`
  let params = Object.assign({
    format: 'json',
    // data: JSON.stringify(data),
    data,
  });
  let props = {
    method: 'get',
    params,
    options: {},
  };
  if (songmid) {
    await apis.UCommon(props).then((res) => {
      let response = res.data;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no songmid',
    }
  }
});

// album
// albummid=0016l2F430zMux
router.get('/getAlbumInfo/:albummid?', async (ctx, next) => {
  let albummid = ctx.query.albummid;
  let params = Object.assign({
    format: 'json',
    albummid,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (albummid) {
    await apis.getAlbumInfo(props).then((res) => {
      let response = res.data;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'no albummid',
    }
  }
});

// comments
// albumm_id: album请求结果的id值
// rootcommentid: 上一次请求结果的最后一项, comment.commentlist[commentlist.length - 1].rootcommentid
// albumm_id=8220
// rootcommentid=album_8220_1003310416_1558068713
// cid=205360772
router.get('/getAlbumComments/:albumm_id?/:rootcommentid?/:cid?/:pagesize?/:pagenum?/:cmd?/:reqtype?/:biztype?', async (ctx, next) => {
  let albumm_id = ctx.query.albumm_id;
  let pagesize = ctx.query.pagesize || 25;
  let pagenum = ctx.query.pagenum || 0;
  let cid = ctx.query.cid || 205360772;
  let cmd = ctx.query.cmd || 8;
  let reqtype = ctx.query.reqtype || 2;
  let biztype = ctx.query.biztype || 2;
  let rootcommentid = pagenum ? ctx.query.rootcommentid : '';
  let checkrootcommentid = !pagenum ? true : !!rootcommentid;
  let params = Object.assign({
    format: 'json',
    outCharset: 'GB2312',
    cid,
    reqtype,
    biztype,
    topid: albumm_id,
    cmd,
    needmusiccrit: 0,
    pagenum,
    pagesize,
    lasthotcommentid: rootcommentid,
    domain: 'qq.com',
    ct: 24,
    cv: 10101010,
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (albumm_id && checkrootcommentid) {
    await apis.getAlbumComments(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'Don\'t have albumm_id or rootcommentid',
    }
  }
});

// recommend
router.get('/getRecommend', async (ctx, next) => {
  let data = {
    comm: {
      ct: 24
    },
    category: {
      method: "get_hot_category",
      param: {
        qq: ""
      },
      module: "music.web_category_svr"
    },
    recomPlaylist: {
      method: "get_hot_recommend",
      param: {
        async: 1,
        cmd: 2
      },
      module: "playlist.HotRecommendServer"
    },
    playlist: {
      method: "get_playlist_by_category",
      param: {
        id: 8,
        curPage: 1,
        size: 40,
        order: 5,
        titleid: 8
      },
      module: "playlist.PlayListPlazaServer"
    },
    new_song: {
      module: "newsong.NewSongServer",
      method: "get_new_song_info",
      param: {
        type: 5
      }
    },
    new_album: {
      module: "newalbum.NewAlbumServer",
      method: "get_new_album_info",
      param: {
        area: 1,
        sin: 0,
        num: 10
      }
    },
    new_album_tag: {
      module: "newalbum.NewAlbumServer",
      method: "get_new_album_area",
      param: {}
    },
    toplist: {
      module: "musicToplist.ToplistInfoServer",
      method: "GetAll",
      param: {}
    },
    focus: {
      module: "QQMusic.MusichallServer",
      method: "GetFocus",
      param: {}
    }
  };
  let params = Object.assign({
    format: 'json',
    data: JSON.stringify(data),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  await apis.UCommon(props).then((res) => {
    let response = res.data;
    ctx.status = 200;
    ctx.body = {
      response,
    }
  }).catch(error => {
    console.log(`error`.error, error);
  });
});

// mv play
// vid=u00222le4ox
router.get('/getMvPlay/:vid?', async (ctx, next) => {
  let vid = ctx.query.vid;
  let data = {
    comm: {
      ct: 24,
      cv: 4747474
    },
    mvinfo: {
      module: "video.VideoDataServer",
      method: "get_video_info_batch",
      param: {
        vidlist: [vid],
        required: [
          "vid",
          "type",
          "sid",
          "cover_pic",
          "duration",
          "singers",
          "video_switch",
          "msg",
          "name",
          "desc",
          "playcnt",
          "pubdate",
          "isfav",
          "gmid"
        ]
      }
    },
    other: {
      module: "video.VideoLogicServer",
      method: "rec_video_byvid",
      param: {
        vid,
        required: [
          "vid",
          "type",
          "sid",
          "cover_pic",
          "duration",
          "singers",
          "video_switch",
          "msg",
          "name",
          "desc",
          "playcnt",
          "pubdate",
          "isfav",
          "gmid",
          "uploader_headurl",
          "uploader_nick",
          "uploader_encuin",
          "uploader_uin",
          "uploader_hasfollow",
          "uploader_follower_num"
        ],
        support: 1
      }
    }
  };
  let params = Object.assign({
    format: 'json',
    data: JSON.stringify(data),
  });
  let props = {
    method: 'get',
    params,
    options: {}
  };
  if (vid) {
    await apis.UCommon(props).then((res) => {
      let response = res.data;
      ctx.status = 200;
      ctx.body = {
        response,
      }
    }).catch(error => {
      console.log(`error`.error, error);
    });
  } else {
    ctx.status = 400;
    ctx.body = {
      response: 'vid is null',
    }
  }
});

module.exports = router;