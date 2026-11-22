/*!
 * QuokaKit v2.0 — 쿼카연구회 홈페이지 조각들
 * quoka-face.js 다음에 불러온다. 모두 웹 컴포넌트라 React 안에서도 그대로 쓸 수 있다.
 *
 *   <quoka-avatar seed="햇살쌤" size="56">          회원·분과 아바타
 *   <quoka-state type="empty">                     빈 화면·불러오는 중·검색 없음·404·완료·점검 중
 *   <quoka-checkin>                                마음 체크인(이벤트: checkin)
 *   <quoka-badges earned="sprout pencil" wear="pencil">  활동 기록 아이템(이벤트: wear)
 *   <quoka-roadmap>                                월별 활동 로드맵(.months 로 데이터 교체)
 *   <quoka-icon name="bell" badge="3">             메뉴 아이콘 48종 + 분과·팀 11종. 올리면 뜻에 맞게 움직인다(animate="loop|none", el.play())
 *   <quoka-nav active="archive" brand="쿼카연구회">  메뉴바: 넓으면 위 메뉴, 좁으면 아래 탭, mode="grid"면 바로가기 타일
 *   <quoka-guide><p data-expression="idea">…</p>  말하는 쿼카 도우미(floating이면 화면 구석에 떠 있다)
 *   <quoka-login>                                  아이디를 따라보고, 비밀번호엔 선글라스를 내리는 로그인 상자
 *   쿼카 캘린더용(1.5): <quoka-nav mode="side"> 사이드 메뉴 · <quoka-tabs> 스크롤바 없는 탭 · <quoka-event> 행사·연수 카드
 *                      <quoka-calendar> 월 달력 · <quoka-stat> 숫자 칸 · <quoka-bars> 월별 막대
 *   홈페이지 조각(1.6): QuokaKit.toast() 알림 · <quoka-sheet> 창 · <quoka-post> 게시글 줄 · <quoka-file> 자료 줄
 *                      <quoka-member> 멤버 카드(연락처 가림) · <quoka-poll> 투표 · <quoka-countdown> D-day · <quoka-faq> 자주 묻는 질문
 *   홈페이지 기본(1.7): <quoka-hero> 첫 화면 · <quoka-banner> 공지 띠 · <quoka-features> 특징 칸 · <quoka-timeline> 연혁
 *                      <quoka-gallery> 사진첩(크게 보기 · 얼굴 덮기) · <quoka-photo-blur> 올리기 전 얼굴 가리기 · QuokaKit.blurFaces()
 *                      <quoka-contact> 문의(개인정보 동의) · <quoka-footer> 바닥글 · <quoka-totop> 맨 위로 · <quoka-theme> 다크 모드
 *                      <quoka-pager> 쪽 번호 · <quoka-skeleton> 불러오는 중 뼈대 · <quoka-share> 공유
 *   쿼카마을(1.8): <quoka-village> 분과별 방 · 돌아다니기 · 채팅·표정·손 들기·모여요 · 방 꾸미기(가구 18) · QuokaKit.villageLocal()
 *   쿼카마을 1.9: art="village/" 그림 마을(지도·방·가구·몸 그림) · 포스트잇 보드 · 모임(주제·타이머·출석 도장) · 자료 책장 · 활동 쌓이면 집 레벨업
 *   2.0: <quoka-ops> 운영실(팀 보드 · 요청함 · 프로젝트 TF · 지역연구회 확인) · <quoka-org> 공개 조직도 · <quoka-regions> 지역연구회 모음 + 지역 페이지(임원이 고침) · QuokaKit.localStore()
 *   QuokaKit.card(canvas, {...}) / QuokaKit.cardBlob({...})  공유 썸네일 1200×630
 *   <quoka-face follow>                            마우스를 따라보는 쿼카(quoka-face.js)
 *
 * 색은 CSS 변수로 바꿀 수 있다: --qk-ink --qk-muted --qk-line --qk-surface --qk-soft --qk-accent --qk-accent-soft --qk-mint
 */
(function (root) {
  'use strict';
  var Q = root.QuokaFace;
  if (!Q) { console.warn('QuokaKit: quoka-face.js를 먼저 불러와 주세요.'); return; }

  // ── 메뉴 아이콘: 64칸 격자에 도형으로 그린다 ──────────────────────────
  // 핑크·민트가 주인공, 버터 노랑·라벤더·쿼카 갈색이 거든다(아쿠아·오렌지는 쓰지 않는다)
  var IC = { p: '#F08DAE', pd: '#D4698F', pl: '#FFD3E0', m: '#74D3BA', md: '#48B096', ml: '#CDEFE3', c: '#FFF5E8', c2: '#FCEBD5',
    y: '#F6CD5B', yd: '#DDA93A', yl: '#FFF0BC', v: '#B7A3F0', vd: '#8F79DB', vl: '#E9E2FF', b: '#C98A55', bd: '#8A5638', bl: '#F3DCC4', w: '#FFFFFF' };
  function heart(cx, cy, s, fill) { // 64칸 기준 하트를 (cx, cy)에 s배로
    return '<path transform="translate(' + cx + ' ' + cy + ') scale(' + s + ') translate(-32 -32.5)" fill="' + fill + '" d="M32 52.5C29.5 50.6 10 38.6 10 24.6C10 17.8 15.2 12.6 21.8 12.6C26.2 12.6 29.8 15 32 18.6C34.2 15 37.8 12.6 42.2 12.6C48.8 12.6 54 17.8 54 24.6C54 38.6 34.5 50.6 32 52.5Z"/>';
  }
  function line(d, color, w) { return '<path d="' + d + '" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'; }
  var ICONS = {
    archive: function () { // 자료실: 서류가 비죽 나온 폴더
      return '<path d="M8 20a5 5 0 0 1 5-5h11.2a4 4 0 0 1 3.2 1.6L30 20H51a5 5 0 0 1 5 5V47a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5Z" fill="' + IC.md + '"/>' +
        '<rect x="15" y="11" width="26" height="24" rx="3" fill="' + IC.c + '" transform="rotate(-7 28 23)"/>' +
        '<rect x="23" y="9.5" width="26" height="24" rx="3" fill="' + IC.pl + '" transform="rotate(6 36 21.5)"/>' +
        '<path d="M8 30a5 5 0 0 1 5-5H51a5 5 0 0 1 5 5V47a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5Z" fill="' + IC.m + '"/>' +
        '<rect x="25.5" y="36.5" width="13" height="3.6" rx="1.8" fill="' + IC.ml + '"/>';
    },
    training: function () { // 연수: 이젤 위 발표판
      return line('M25 44L18.5 56M39 44L45.5 56M32 44V53', IC.pd, 3.6) +
        '<rect x="28.5" y="7" width="7" height="6" rx="2.4" fill="' + IC.pd + '"/>' +
        '<rect x="9" y="11" width="46" height="34" rx="6" fill="' + IC.p + '"/>' +
        '<rect x="13.5" y="15.5" width="37" height="25" rx="3.5" fill="' + IC.c + '"/>' +
        '<rect x="19.5" y="30" width="6" height="6" rx="1.8" fill="' + IC.m + '"/>' +
        '<rect x="29" y="25" width="6" height="11" rx="1.8" fill="' + IC.m + '"/>' +
        '<rect x="38.5" y="20" width="6" height="16" rx="1.8" fill="' + IC.md + '"/>';
    },
    casebook: function () { // 사례집: 펼친 책과 책갈피
      return '<rect x="7" y="19" width="50" height="34" rx="5" fill="' + IC.md + '"/>' +
        '<path d="M32 21C26.5 16.6 18.6 15.2 11 16.4V46.6C18.6 45.6 26.5 46.8 32 51Z" fill="' + IC.c + '"/>' +
        '<path d="M32 21C37.5 16.6 45.4 15.2 53 16.4V46.6C45.4 45.6 37.5 46.8 32 51Z" fill="' + IC.c2 + '"/>' +
        line('M15.5 24.6Q21 23.6 27 25.6M15.5 30.4Q21 29.4 27 31.4M15.5 36.2Q20 35.4 24 36.6', '#BDE7D8', 2.4) +
        line('M36.5 31.4Q42 29.4 48.5 30.4M36.5 37.2Q42 35.2 48.5 36.2', '#BDE7D8', 2.4) +
        '<path d="M40.5 13H47V29.5L43.75 26.6L40.5 29.5Z" fill="' + IC.p + '"/>';
    },
    notice: function () { // 공지: 메가폰과 소리 물결
      return '<path d="M19.5 36.5L23.6 49.4A2.8 2.8 0 0 0 27 51.2L28.2 50.9A2.8 2.8 0 0 0 30 47.5L26.6 36.2Z" fill="' + IC.pd + '"/>' +
        '<path d="M15 24.5H22.5L41 14V46L22.5 35.5H15A4 4 0 0 1 11 31.5V28.5A4 4 0 0 1 15 24.5Z" fill="' + IC.p + '"/>' +
        '<ellipse cx="41.5" cy="30" rx="4.6" ry="16.5" fill="' + IC.pd + '"/>' +
        '<ellipse cx="42.6" cy="30" rx="2.6" ry="12.4" fill="' + IC.pl + '"/>' +
        line('M51 21.5L55.5 18.5M52 30H57.5M51 38.5L55.5 41.5', IC.m, 3.4);
    },
    events: function () { // 행사: 하트 표시한 달력
      var cells = '', cols = [15.5, 29, 42.5], rows = [31, 39.5, 48];
      rows.forEach(function (y, r) { cols.forEach(function (x, c) { if (!(r === 1 && c === 1)) cells += '<rect x="' + x + '" y="' + y + '" width="6" height="5.6" rx="1.8" fill="' + IC.ml + '"/>'; }); });
      return '<rect x="9" y="13" width="46" height="43" rx="7" fill="' + IC.c + '"/>' +
        '<path d="M9 20A7 7 0 0 1 16 13H48A7 7 0 0 1 55 20V25H9Z" fill="' + IC.m + '"/>' +
        '<rect x="18.5" y="8" width="5.4" height="10" rx="2.7" fill="' + IC.md + '"/><rect x="40.1" y="8" width="5.4" height="10" rx="2.7" fill="' + IC.md + '"/>' +
        cells + heart(32, 42.4, 0.24, IC.p);
    },
    community: function () { // 분과: 진짜 쿼카 셋
      var head = function (x, y, s, ex) { return Q.svg({ expression: ex }).replace('<svg ', '<svg x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" '); };
      return head(-1, 22, 34, 'happy') + head(31, 22, 34, 'calm') + head(11, 7, 42, 'smile');
    },
    search: function () { // 검색: 돋보기
      return line('M40 40L51.5 51.5', IC.md, 8.5) +
        '<circle cx="27" cy="27" r="17" fill="' + IC.m + '"/>' +
        '<circle cx="27" cy="27" r="11.6" fill="#E6F8F1"/>' +
        line('M19.6 25.2A8 8 0 0 1 25.4 19.4', '#FFFFFF', 3);
    },
    checkin: function () { // 마음 체크인: 하트와 체크 배지
      return heart(32, 32, 1, IC.p) +
        '<ellipse cx="20.5" cy="22.5" rx="4.4" ry="2.6" fill="' + IC.pl + '" transform="rotate(-38 20.5 22.5)"/>' +
        '<circle cx="47.5" cy="46.5" r="10.4" fill="' + IC.c + '"/><circle cx="47.5" cy="46.5" r="8.6" fill="' + IC.md + '"/>' +
        line('M43.4 46.6L46.4 49.4L51.6 43.8', IC.c, 3);
    }
  };

  // 도형 도우미
  function R(x, y, w, h, r, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function Ci(cx, cy, r, fill, extra) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function Pa(d, fill, extra) { return '<path d="' + d + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function poly(cx, cy, pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + (cx + p[0]).toFixed(2) + ' ' + (cy + p[1]).toFixed(2); }).join('') + 'Z'; }
  function gearD(cx, cy, ro, ri, n) {
    var pts = [], st = Math.PI * 2 / n;
    for (var k = 0; k < n; k++) {
      var a = k * st - Math.PI / 2, w1 = st * 0.3, w2 = st * 0.18;
      [[ri, a - w1], [ro, a - w2], [ro, a + w2], [ri, a + w1]].forEach(function (q) { pts.push([Math.cos(q[1]) * q[0], Math.sin(q[1]) * q[0]]); });
    }
    return poly(cx, cy, pts);
  }
  function starD(cx, cy, ro, ri) {
    var pts = [];
    for (var k = 0; k < 10; k++) { var a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? ri : ro; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    return poly(cx, cy, pts);
  }
  var ROUND = function (c, w) { return ' stroke="' + c + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round"'; };

  // 메뉴 아이콘 40종 추가. cat: 연구회 · 자료 · 연수·행사 · AI·수업 · 사이트
  var MORE_ICONS = {
    // ── 연구회 ──
    home: ['홈', '연구회', function () {
      return R(39.5, 13, 6.5, 11, 1.6, IC.pd) +
        Pa('M8.5 30.5L32 11L55.5 30.5a3 3 0 0 1-1.9 5.3H10.4a3 3 0 0 1-1.9-5.3Z', IC.p) +
        R(14.5, 33, 35, 21, 4, IC.yl) + Pa('M27 54V45a5 5 0 0 1 10 0v9Z', IC.m) +
        R(17.5, 38, 7, 6.4, 1.8, IC.ml) + R(39.5, 38, 7, 6.4, 1.8, IC.ml) + heart(32, 25, 0.17, IC.w);
    }],
    about: ['연구회 소개', '연구회', function () {
      return line('M17 10V53', IC.bd, 3.2) + R(10.5, 51, 13, 4.6, 2.3, IC.bd) +
        Pa('M18.5 13C26 9 32 17 40 14C44 12.6 47 12.4 50.5 13.4V33.4C47 32.4 44 32.6 40 34C32 37 26 29 18.5 33Z', IC.p) +
        heart(34.5, 23.6, 0.27, IC.w) + Ci(17, 9.4, 2.6, IC.y);
    }],
    members: ['회원', '연구회', function () {
      return Ci(41, 22, 7, IC.vd) + Pa('M28 52V49a13 13 0 0 1 26 0v3Z', IC.v) +
        Ci(25, 26.5, 8.6, IC.pd) + Pa('M9 55V52a16 16 0 0 1 32 0v3Z', IC.p) +
        '<ellipse cx="22" cy="24" rx="2.2" ry="1.2" fill="' + IC.pl + '" opacity=".8"/>';
    }],
    join: ['가입 신청', '연구회', function () {
      return Ci(27, 22, 9, IC.md) + Pa('M10 54V51a17 17 0 0 1 34 0v3Z', IC.m) +
        Ci(46, 42, 11.5, IC.w) + Ci(46, 42, 9.6, IC.y) + line('M46 37V47M41 42H51', IC.bd, 3.2);
    }],
    mypage: ['내 정보', '연구회', function () {
      return R(8, 15, 48, 34, 6, IC.vl) + R(26.5, 10.5, 11, 8, 2.6, IC.p) +
        R(13, 22, 15, 20, 3, IC.v) + Ci(20.5, 29, 3.6, IC.w) + Pa('M14.8 40a5.7 5.7 0 0 1 11.4 0Z', IC.w) +
        R(32, 24, 18, 3.6, 1.8, IC.vd) + R(32, 31, 14, 3, 1.5, IC.v) + R(32, 37, 16, 3, 1.5, IC.v);
    }],
    message: ['쪽지', '연구회', function () {
      return R(9, 17, 46, 32, 6, IC.yl) + Pa('M11 19.6Q12.6 17 15 17H49Q51.4 17 53 19.6L34.6 33.4a4.4 4.4 0 0 1-5.2 0Z', IC.y) +
        line('M12.5 45.5L25 34M51.5 45.5L39 34', IC.y, 2.4) + heart(32, 30.6, 0.25, IC.p);
    }],
    qa: ['묻고 답하기', '연구회', function () {
      return R(27, 24, 29, 21, 8, IC.p) + Pa('M46 43L52 51L40 43.5Z', IC.p) + line('M41.5 29.5V35.6', IC.w, 3) + Ci(41.5, 39.6, 1.8, IC.w) +
        R(8, 11, 31, 23, 9, IC.m) + Pa('M14 32L10.5 41L22 33Z', IC.m) +
        line('M19.4 19.4a4.2 4.2 0 1 1 5.6 4c-1.2.5-1.5 1.1-1.5 2.2', IC.w, 2.8) + Ci(23.5, 29.4, 1.8, IC.w);
    }],
    gallery: ['사진첩', '연구회', function () {
      return R(13, 11, 34, 28, 4, IC.v, ' transform="rotate(-9 30 25)"') +
        R(15, 18, 38, 32, 5, IC.y) + R(19, 22, 30, 24, 3, IC.yl) +
        Pa('M19 43L28 33L34 39L38 35L49 46V43a3 3 0 0 1-3 3H22a3 3 0 0 1-3-3Z', IC.m) + Ci(41, 28.5, 3.2, IC.p);
    }],
    // ── 자료 ──
    download: ['내려받기', '자료', function () {
      return Pa('M9 40h12l3 5h16l3-5h12v9a6 6 0 0 1-6 6H15a6 6 0 0 1-6-6Z', IC.m) +
        line('M32 9V33', IC.p, 5) + line('M23 25L32 34L41 25', IC.p, 5);
    }],
    upload: ['올리기', '자료', function () {
      return Pa('M18 47a10 10 0 0 1-1.4-19.9A15 15 0 0 1 45 24.4 11.4 11.4 0 0 1 47 47Z', IC.v) +
        line('M32 42V27', IC.w, 4.4) + line('M25.5 33L32 26.5L38.5 33', IC.w, 4.4);
    }],
    document: ['문서·수업안', '자료', function () {
      return Pa('M17 8h21l13 13v31a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z', IC.vl) +
        Pa('M38 8v9a4 4 0 0 0 4 4h9Z', IC.v) +
        R(19, 20, 13, 3.6, 1.8, IC.vd) + R(19, 28, 25, 3.2, 1.6, IC.v) + R(19, 35, 25, 3.2, 1.6, IC.v) + R(19, 42, 17, 3.2, 1.6, IC.v) +
        heart(42.5, 46.5, 0.2, IC.p);
    }],
    worksheet: ['활동지', '자료', function () {
      var row = function (y, done) { return R(17, y, 6, 6, 1.8, done ? IC.y : IC.yl, done ? '' : ROUND(IC.y, 1.6)) + R(26, y + 1.4, 13, 3.2, 1.6, IC.y); };
      return R(11, 9, 32, 44, 5, IC.yl, ROUND(IC.y, 0.01)) + R(11, 9, 32, 44, 5, IC.yl) + row(17, true) + row(27, true) + row(37, false) +
        '<g transform="rotate(38 46 38)">' + R(42, 20, 8, 26, 2, IC.p) + R(42, 16, 8, 5.5, 2, IC.pl) + R(42, 21, 8, 3, 0, IC.pd) +
        Pa('M42 46h8l-4 8Z', IC.bl) + Pa('M44.6 51.2h2.8L46 54Z', IC.bd) + '</g>';
    }],
    slides: ['발표 자료', '자료', function () {
      return R(16, 11, 40, 29, 5, IC.ml) + R(8, 20, 40, 29, 5, IC.m) +
        R(13, 25, 16, 3.6, 1.8, IC.w) + R(13, 33, 4.4, 10, 1.4, IC.w) + R(19.6, 36, 4.4, 7, 1.4, IC.w) +
        Ci(37, 37, 6.4, IC.w) + Pa('M37 37V30.6a6.4 6.4 0 0 1 6.4 6.4Z', IC.p) + line('M24 49V55M32 49V55', IC.md, 3) ;
    }],
    video: ['영상', '자료', function () {
      return R(9, 26, 46, 27, 6, IC.v) +
        '<g transform="rotate(-9 10 26)">' + R(9, 16, 46, 9, 3, IC.bd) + line('M18 17.5L15 23.5M28 17.5L25 23.5M38 17.5L35 23.5M48 17.5L45 23.5', IC.w, 2.6) + '</g>' +
        Pa('M28.5 33.5L39 39.5L28.5 45.5Z', IC.w, ROUND(IC.w, 2.4));
    }],
    data: ['통계', '자료', function () {
      return R(12, 34, 9, 19, 3, IC.m) + R(25, 25, 9, 28, 3, IC.p) + R(38, 16, 9, 37, 3, IC.v) +
        line('M9 55H55', IC.bd, 2.8) + spark(52, 11, 5, IC.y) + spark(56, 20, 2.4, IC.y);
    }],
    link: ['링크', '자료', function () {
      return '<g transform="rotate(-45 32 32)">' +
        '<rect x="8" y="24.5" width="27" height="15" rx="7.5" fill="none"' + ROUND(IC.m, 5.5) + '/>' +
        '<rect x="29" y="24.5" width="27" height="15" rx="7.5" fill="none"' + ROUND(IC.p, 5.5) + '/></g>';
    }],
    // ── 연수·행사 ──
    certificate: ['수료증', '연수·행사', function () {
      return R(7, 11, 50, 35, 5, IC.yl) + R(11, 15, 42, 27, 3, 'none', ROUND(IC.y, 1.6)) +
        R(16, 21, 22, 3.6, 1.8, IC.yd) + R(16, 28, 16, 3, 1.5, IC.y) + R(16, 34, 12, 3, 1.5, IC.y) +
        Pa('M40 44L36.5 56L41.5 53L44.5 57.5L46 45Z', IC.p) + Pa('M48.5 44L52 56L47 53L44 57.5L42.5 45Z', IC.pd) +
        Ci(44.5, 40, 8.4, IC.p) + Ci(44.5, 40, 5, IC.pl) + spark(44.5, 40, 2.8, IC.p);
    }],
    trophy: ['연구대회', '연수·행사', function () {
      return '<path d="M20 17h-4.5a5 5 0 0 0 0 10H21M44 17h4.5a5 5 0 0 1 0 10H43" fill="none"' + ROUND(IC.yd, 3.6) + '/>' +
        Pa('M19 11h26v12a13 13 0 0 1-26 0Z', IC.y) + R(29, 34, 6, 7, 2, IC.yd) +
        R(22, 40, 20, 5, 2.5, IC.yd) + R(18, 45, 28, 8, 3, IC.bd) + R(25, 47.6, 14, 3, 1.5, IC.yl) + spark(32, 21.5, 5.4, IC.w);
    }],
    mic: ['강연', '연수·행사', function () {
      return '<path d="M19 28a13 13 0 0 0 26 0" fill="none" stroke="' + IC.md + '" stroke-width="3.6" stroke-linecap="round"/>' +
        line('M32 41V50', IC.md, 3.6) + R(22, 48.5, 20, 5, 2.5, IC.md) +
        R(24, 8, 16, 27, 8, IC.p) + line('M27 16H37M27 21.5H37', IC.pl, 2.2) + spark(49, 13, 4, IC.y);
    }],
    ticket: ['참가 신청', '연수·행사', function () {
      return '<g transform="rotate(-8 32 32)">' +
        Pa('M8 21a4 4 0 0 1 4-4h40a4 4 0 0 1 4 4v6a5 5 0 0 0 0 10v6a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-6a5 5 0 0 0 0-10Z', IC.v) +
        '<path d="M42 19.5V44.5" stroke="' + IC.w + '" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 4.4"/>' +
        R(15, 25, 19, 3.6, 1.8, IC.w) + R(15, 32, 13, 3, 1.5, IC.vl) + R(15, 38, 16, 3, 1.5, IC.vl) + spark(49, 32, 4.6, IC.y) + '</g>';
    }],
    clock: ['시간표', '연수·행사', function () {
      return Ci(17, 15, 6.2, IC.p) + Ci(47, 15, 6.2, IC.p) + line('M19.5 50.5L16 55M44.5 50.5L48 55', IC.md, 3.4) +
        Ci(32, 34, 19, IC.m) + Ci(32, 34, 14.4, IC.w) +
        line('M32 34V25.4', IC.bd, 3) + line('M32 34L38.6 37.6', IC.p, 3) + Ci(32, 34, 2.3, IC.bd);
    }],
    location: ['장소', '연수·행사', function () {
      return '<ellipse cx="32" cy="53" rx="12.5" ry="3.8" fill="' + IC.bl + '"/>' +
        Pa('M32 7a16 16 0 0 1 16 16c0 11.6-16 28-16 28S16 34.6 16 23A16 16 0 0 1 32 7Z', IC.p) + Ci(32, 23, 6.4, IC.w) + heart(32, 23.3, 0.14, IC.p);
    }],
    coffee: ['소모임', '연수·행사', function () {
      return '<path d="M43 31h3.5a6.5 6.5 0 0 1 0 13H42" fill="none"' + ROUND(IC.b, 4) + '/>' +
        Pa('M12 25h32v17a10 10 0 0 1-10 10H22a10 10 0 0 1-10-10Z', IC.b) + R(12, 23.5, 32, 5, 2.5, IC.bd) +
        heart(28, 40, 0.26, IC.w) + line('M22 18c-2.4-3 2.4-5 0-8M32 18c-2.4-3 2.4-5 0-8', IC.m, 2.6) + heart(41.5, 13, 0.18, IC.p);
    }],
    camera: ['행사 사진', '연수·행사', function () {
      return R(20, 13, 14, 10, 3, IC.vd) + R(8, 19, 48, 33, 8, IC.v) + R(44, 24.5, 7, 4.2, 2.1, IC.y) +
        Ci(32, 36, 11.6, IC.w) + Ci(32, 36, 8, IC.vd) + Ci(29.4, 33.4, 2.4, IC.w);
    }],
    // ── AI·수업 ──
    'ai-chat': ['AI 도우미', 'AI·수업', function () {
      return R(8, 12, 44, 32, 12, IC.m) + Pa('M16 41L12.5 52L27 43Z', IC.m) +
        Ci(21, 28, 3.2, IC.w) + Ci(30, 28, 3.2, IC.w) + Ci(39, 28, 3.2, IC.w) + spark(51, 13, 7.4, IC.y) + spark(57.5, 23, 3, IC.p);
    }],
    sparkles: ['AI 생성', 'AI·수업', function () {
      return spark(26, 32, 16, IC.v) + spark(47, 15, 8.4, IC.p) + spark(47, 45, 7.4, IC.y) + Ci(13, 13, 2.6, IC.m) + Ci(53, 30, 2, IC.m);
    }],
    idea: ['아이디어', 'AI·수업', function () {
      return line('M10.5 23H5.5M58.5 23H53.5M14.4 9.4L10.8 5.8M49.6 9.4L53.2 5.8', IC.yd, 2.8) +
        Pa('M32 8a15.5 15.5 0 0 1 9 28.2V41H23v-4.8A15.5 15.5 0 0 1 32 8Z', IC.y) +
        line('M27 25.5L32 30.5L37 25.5M32 30.5V38', IC.yd, 2.4) + R(23.5, 41, 17, 5, 2, IC.v) + R(26, 47, 12, 5.6, 2.6, IC.vd);
    }],
    puzzle: ['활동·놀이', 'AI·수업', function () {
      return Pa('M13 20h10.5a5.2 5.2 0 1 1 10.4 0H44v10.4a5.2 5.2 0 1 1 0 10.4V51H33.9a5.2 5.2 0 1 0-10.4 0H13V40.8a5.2 5.2 0 1 0 0-10.4Z', IC.p) +
        Pa('M33.9 20H44v10.4a5.2 5.2 0 1 1 0 10.4V51H33.9a5.2 5.2 0 1 0-0.1 0Z', IC.pd, ' opacity=".0"') +
        R(18, 25, 5, 5, 2, IC.pl) + spark(53, 13, 5, IC.m);
    }],
    plant: ['성장 기록', 'AI·수업', function () {
      return line('M32 35V22', IC.md, 3.2) +
        Pa('M32 25C30 16 22 12.4 14.4 14c1 8.4 8.4 12.6 17.6 11Z', IC.m) + Pa('M32 22.6c1-8.2 8.2-12.4 16.6-11.2-1 8.2-7.4 12.4-16.6 11.2Z', IC.md) +
        R(16.5, 34, 31, 6.4, 2.6, IC.bd) + Pa('M19 40h26l-3.2 12.6a3 3 0 0 1-2.9 2.4H25.1a3 3 0 0 1-2.9-2.4Z', IC.b) + heart(32, 47, 0.18, IC.bl);
    }],
    palette: ['창작', 'AI·수업', function () {
      return Pa('M32 9C18 9 8 18.6 8 30.5S18 52 30 52c4 0 5.2-3 3.4-5.6-1.8-3 .6-6.4 4.2-6.4H44c6.6 0 12-4.6 12-11C56 18 45.6 9 32 9Z', IC.bl) +
        Ci(19.5, 24, 4.4, IC.p) + Ci(30, 17, 4.4, IC.y) + Ci(42, 18.5, 4.4, IC.m) + Ci(48.5, 29, 4.4, IC.v) + Ci(19.5, 37.5, 4.4, IC.w);
    }],
    globe: ['세계시민', 'AI·수업', function () {
      return Ci(32, 33, 21, IC.m) +
        Pa('M20 21c4-1 7 1 7.6 4.4.6 3-2.4 4-1.6 7 .8 3 4.6 3 4.6 6.6 0 3.6-3.4 5.6-6.4 4.6-3.4-1.2-5.4-5.4-7.2-9.4-1.6-3.6-1.4-11.2 3-13.2Z', IC.md) +
        Pa('M39 18.6c3 0 6.6 2 8.6 5.2 2 3.4-1 4.4-4 4.4-3.4 0-4.4 3-2.6 5.4 1.8 2.4 4.6 3 4 6.6-.6 3.4-4.4 5.4-6.4 3.6-2-1.8-1-5-3.4-6.6-2.6-1.6-5.2-3.4-3.8-7.4 1.4-4 4.6-11.2 7.6-11.2Z', IC.md) +
        '<ellipse cx="32" cy="33" rx="21" ry="8" fill="none" stroke="' + IC.w + '" stroke-width="1.8" opacity=".55"/>' + heart(50.5, 13, 0.22, IC.p);
    }],
    game: ['게임 수업', 'AI·수업', function () {
      return Pa('M18 21h28a12 12 0 0 1 11.6 8.9l3 11.4a6.6 6.6 0 0 1-11 6.4L44 42H20l-5.6 5.7a6.6 6.6 0 0 1-11-6.4l3-11.4A12 12 0 0 1 18 21Z', IC.v) +
        R(13.6, 29.8, 11, 3.8, 1.6, IC.w) + R(17.2, 26.2, 3.8, 11, 1.6, IC.w) +
        Ci(44, 27.4, 2.8, IC.p) + Ci(49.6, 32.4, 2.8, IC.y) + Ci(38.4, 32.4, 2.8, IC.m) + Ci(44, 37.4, 2.8, IC.w);
    }],
    // ── 사이트 ──
    bell: ['알림', '사이트', function () {
      return Pa('M32 9a3 3 0 0 1 3 3v1.5A14 14 0 0 1 46 27v8.6l4.2 6.2a2 2 0 0 1-1.7 3.1h-33a2 2 0 0 1-1.7-3.1L18 35.6V27a14 14 0 0 1 11-13.5V12a3 3 0 0 1 3-3Z', IC.y) +
        Pa('M26.4 47.4a5.6 5.6 0 0 0 11.2 0Z', IC.yd) + Ci(46.5, 15, 7.6, IC.w) + Ci(46.5, 15, 6, IC.p);
    }],
    settings: ['설정', '사이트', function () {
      return Pa(gearD(32, 32, 22, 16.5, 8), IC.v, ROUND(IC.v, 3.4)) + Ci(32, 32, 8.4, IC.w) + Ci(32, 32, 4.4, IC.vl);
    }],
    lock: ['로그인', '사이트', function () {
      return '<path d="M22 28v-6.4a10 10 0 0 1 20 0V28" fill="none" stroke="' + IC.md + '" stroke-width="5" stroke-linecap="round"/>' +
        R(14.5, 27, 35, 27, 7.5, IC.m) + Ci(32, 38.5, 3.8, IC.w) + R(30.3, 40, 3.4, 7.4, 1.7, IC.w) + heart(43.4, 33, 0.14, IC.ml);
    }],
    news: ['뉴스레터', '사이트', function () {
      return R(14, 10, 40, 44, 6, IC.p) + R(9, 22, 12, 32, 6, IC.pd) + R(18, 14, 32, 36, 4, IC.w) +
        R(22, 18.5, 22, 4.4, 2.2, IC.p) + R(22, 26, 12, 10, 2.4, IC.m) + R(36.5, 26.5, 10, 2.8, 1.4, IC.pl) + R(36.5, 32, 8, 2.8, 1.4, IC.pl) +
        R(22, 40, 24, 2.8, 1.4, IC.pl) + R(22, 45, 18, 2.8, 1.4, IC.pl);
    }],
    share: ['공유', '사이트', function () {
      return line('M19.5 32L44 18.5M19.5 32L44 45.5', IC.bd, 3) + Ci(18, 32, 8.6, IC.p) + Ci(45, 18, 7.4, IC.m) + Ci(45, 46, 7.4, IC.y);
    }],
    star: ['즐겨찾기', '사이트', function () {
      return Pa(starD(32, 33, 24, 11), IC.y, ROUND(IC.y, 4)) + Ci(26, 33, 2, IC.bd) + Ci(38, 33, 2, IC.bd) +
        line('M29.6 37.6Q32 39.6 34.4 37.6', IC.bd, 1.8) + '<ellipse cx="23" cy="37" rx="2.2" ry="1.3" fill="' + IC.p + '" opacity=".6"/><ellipse cx="41" cy="37" rx="2.2" ry="1.3" fill="' + IC.p + '" opacity=".6"/>';
    }],
    bookmark: ['북마크', '사이트', function () {
      return Pa('M18 9h28a3 3 0 0 1 3 3v41.4a1.6 1.6 0 0 1-2.6 1.3L32 44 17.6 54.7A1.6 1.6 0 0 1 15 53.4V12a3 3 0 0 1 3-3Z', IC.p) +
        heart(32, 25, 0.32, IC.w);
    }],
    help: ['도움말', '사이트', function () {
      var c = 2 * Math.PI * 16.5, seg = c / 8;
      return '<circle cx="32" cy="32" r="16.5" fill="none" stroke="' + IC.w + '" stroke-width="11"/>' +
        '<circle cx="32" cy="32" r="16.5" fill="none" stroke="' + IC.p + '" stroke-width="10.4"/>' +
        '<circle cx="32" cy="32" r="16.5" fill="none" stroke="' + IC.w + '" stroke-width="10.4" stroke-dasharray="' + seg.toFixed(2) + ' ' + seg.toFixed(2) + '" transform="rotate(-22.5 32 32)"/>' +
        '<circle cx="32" cy="32" r="22.2" fill="none" stroke="' + IC.pd + '" stroke-width="1.4" opacity=".5"/><circle cx="32" cy="32" r="10.8" fill="none" stroke="' + IC.pd + '" stroke-width="1.4" opacity=".5"/>';
    }]
  };
  var ICON_META = {
    archive: ['자료실', '자주 쓰는'], training: ['연수', '자주 쓰는'], casebook: ['사례집', '자주 쓰는'], notice: ['공지', '자주 쓰는'],
    events: ['행사', '자주 쓰는'], community: ['분과', '자주 쓰는'], search: ['검색', '자주 쓰는'], checkin: ['마음 체크인', '자주 쓰는']
  };
  Object.keys(MORE_ICONS).forEach(function (k) { ICONS[k] = MORE_ICONS[k][2]; ICON_META[k] = [MORE_ICONS[k][0], MORE_ICONS[k][1]]; });
  var ICON_LIST = Object.keys(ICON_META).map(function (k) { return { key: k, label: ICON_META[k][0], cat: ICON_META[k][1] }; });

  // ── 분과·팀 아이콘 ────────────────────────────────────────────────
  // 분과 = 동그란 배지 + 오른쪽 위 「AI 반짝이」, 팀 = 둥근 네모 배지
  function spark(x, y, s, fill) {
    return '<path fill="' + fill + '" d="M' + x + ' ' + (y - s) + 'Q' + (x + s * 0.18) + ' ' + (y - s * 0.18) + ' ' + (x + s) + ' ' + y + 'Q' + (x + s * 0.18) + ' ' + (y + s * 0.18) + ' ' + x + ' ' + (y + s) +
      'Q' + (x - s * 0.18) + ' ' + (y + s * 0.18) + ' ' + (x - s) + ' ' + y + 'Q' + (x - s * 0.18) + ' ' + (y - s * 0.18) + ' ' + x + ' ' + (y - s) + 'Z"/>';
  }
  function division(tone, inner) { // tone: 'm' | 'p'
    var bg = tone === 'm' ? IC.ml : IC.pl, mark = tone === 'm' ? IC.pd : IC.md;
    return '<circle cx="32" cy="32" r="30" fill="' + bg + '"/>' + inner + spark(50.5, 12.5, 6.2, mark) + spark(56, 21, 2.8, mark);
  }
  function team(inner) { return '<rect x="3" y="3" width="58" height="58" rx="17" fill="#EEE9FC"/>' + inner; }
  var INK = '#4A2A30';
  var GROUP_ICONS = {
    'ai-civic': function () { // AI민주시민: 투표함
      return division('m',
        '<rect x="15.5" y="31" width="33" height="20" rx="3.5" fill="' + IC.m + '"/>' +
        '<g transform="rotate(-8 32 21)"><rect x="24.5" y="13" width="15" height="18" rx="2.4" fill="#FFFFFF"/>' + line('M28 21.2L31 24.2L36.4 18.4', IC.p, 2.6) + '</g>' +
        '<rect x="13.5" y="26.5" width="37" height="7" rx="2.6" fill="' + IC.md + '"/><rect x="24" y="29" width="16" height="2.2" rx="1.1" fill="#2E8069"/>' +
        heart(32, 42.6, 0.2, IC.p));
    },
    'physical-ai': function () { // 피지컬AI: 쿼카 귀 로봇
      return division('p',
        line('M32 20V13.6', IC.md, 2.6) + '<circle cx="32" cy="12.4" r="3.2" fill="' + IC.p + '"/>' +
        '<circle cx="18.6" cy="23" r="6.2" fill="' + IC.md + '"/><circle cx="45.4" cy="23" r="6.2" fill="' + IC.md + '"/>' +
        '<circle cx="18.6" cy="23" r="3" fill="' + IC.ml + '"/><circle cx="45.4" cy="23" r="3" fill="' + IC.ml + '"/>' +
        '<rect x="23.5" y="46" width="17" height="7" rx="2.6" fill="' + IC.md + '"/>' +
        '<rect x="14.5" y="19.5" width="35" height="29" rx="10" fill="' + IC.m + '"/>' +
        '<rect x="19.5" y="25.5" width="25" height="16" rx="5.5" fill="#1E3B33"/>' +
        '<circle cx="27" cy="32.6" r="2.7" fill="#BFF5E3"/><circle cx="37" cy="32.6" r="2.7" fill="#BFF5E3"/>' +
        line('M29.4 37.4Q32 39.4 34.6 37.4', '#BFF5E3', 1.8));
    },
    'ai-media': function () { // AI미디어: 재생 화면
      return division('m',
        '<rect x="28" y="43" width="8" height="6" fill="' + IC.md + '"/><rect x="21" y="47.6" width="22" height="4" rx="2" fill="' + IC.md + '"/>' +
        '<rect x="12.5" y="17.5" width="39" height="27" rx="5.5" fill="' + IC.m + '"/>' +
        '<rect x="16" y="21" width="32" height="20" rx="3.2" fill="' + IC.c + '"/>' +
        '<path d="M29 26.2L37.8 31L29 35.8Z" fill="' + IC.p + '" stroke="' + IC.p + '" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<circle cx="44" cy="24.6" r="1.8" fill="' + IC.pd + '"/>');
    },
    'ai-sel': function () { // AI사회정서: 웃는 하트
      return division('p',
        heart(32, 34.5, 0.82, IC.p) +
        '<circle cx="26.4" cy="31.4" r="2" fill="' + INK + '"/><circle cx="37.6" cy="31.4" r="2" fill="' + INK + '"/>' +
        line('M28.6 36.2Q32 39.6 35.4 36.2', INK, 2.1) +
        '<ellipse cx="22.6" cy="36" rx="2.8" ry="1.7" fill="' + IC.pl + '"/><ellipse cx="41.4" cy="36" rx="2.8" ry="1.7" fill="' + IC.pl + '"/>' +
        heart(15.5, 20, 0.2, IC.m));
    },
    'ai-dev': function () { // AI개발: 코드 창
      return division('m',
        '<rect x="11.5" y="17" width="41" height="31" rx="5.5" fill="' + IC.c + '"/>' +
        '<path d="M11.5 22.5a5.5 5.5 0 0 1 5.5-5.5h30a5.5 5.5 0 0 1 5.5 5.5v1.6h-41Z" fill="' + IC.md + '"/>' +
        '<circle cx="16.6" cy="20.6" r="1.4" fill="' + IC.p + '"/><circle cx="20.8" cy="20.6" r="1.4" fill="' + IC.ml + '"/><circle cx="25" cy="20.6" r="1.4" fill="#FFFFFF"/>' +
        line('M25 30.4L20 35.8L25 41.2M39 30.4L44 35.8L39 41.2', IC.p, 3) + line('M34.4 29.6L29.6 42', IC.md, 3));
    },
    'ai-content': function () { // AI콘텐츠: 그림 카드와 요술봉
      return division('p',
        '<rect x="12" y="16.5" width="35" height="29" rx="5" fill="#FFFFFF"/>' +
        '<rect x="15.5" y="20" width="28" height="22" rx="3" fill="' + IC.ml + '"/>' +
        '<path d="M15.5 39L24 29.6L30.4 36.4L34.6 32.4L43.5 41.2V39A3 3 0 0 1 40.5 42H18.5A3 3 0 0 1 15.5 39Z" fill="' + IC.m + '"/>' +
        '<circle cx="37" cy="26" r="3.2" fill="' + IC.p + '"/>' +
        line('M38.5 51.5L50 40', IC.pd, 3.6) + spark(51.5, 38.5, 5, IC.md) + spark(44, 33, 2.4, IC.md));
    },
    'planning': function () { // 기획운영팀: 체크리스트
      var row = function (y, done) {
        return (done ? '<circle cx="25" cy="' + y + '" r="2.8" fill="' + IC.p + '"/>' + line('M23.6 ' + y + 'L24.7 ' + (y + 1.1) + 'L26.6 ' + (y - 1), '#FFFFFF', 1.3)
          : '<circle cx="25" cy="' + y + '" r="2.4" fill="none" stroke="' + IC.p + '" stroke-width="1.6"/>') +
          '<rect x="30" y="' + (y - 1.5) + '" width="' + (done ? 11 : 8) + '" height="3" rx="1.5" fill="' + IC.ml + '"/>';
      };
      return team('<rect x="17" y="14" width="30" height="40" rx="5" fill="' + IC.m + '"/>' +
        '<rect x="20.5" y="19" width="23" height="31.5" rx="2.6" fill="#FFFFFF"/>' +
        '<rect x="25" y="11.2" width="14" height="7.2" rx="2.6" fill="' + IC.md + '"/>' +
        row(26, true) + row(33.5, true) + row(41, false));
    },
    'training-team': function () { // 연수팀: 학사모와 책
      return team('<rect x="17" y="42" width="30" height="8" rx="2.4" fill="' + IC.m + '"/><rect x="19.4" y="43.8" width="25.2" height="2.6" rx="1.2" fill="' + IC.c + '"/>' +
        '<path d="M20.5 28.4V35.6Q32 42.4 43.5 35.6V28.4L32 33.8Z" fill="' + IC.pd + '"/>' +
        '<path d="M32 15L52 24.4L32 33.8L12 24.4Z" fill="' + IC.p + '"/>' +
        line('M32 24.4L46 27.6V36', IC.md, 1.8) + '<rect x="44.1" y="35" width="3.8" height="6.4" rx="1.6" fill="' + IC.md + '"/>' +
        '<circle cx="32" cy="24.4" r="1.9" fill="' + IC.pd + '"/>');
    },
    'pr': function () { // 홍보팀: 휴대폰과 좋아요 말풍선
      return team('<rect x="18.5" y="12" width="23" height="40" rx="5.2" fill="' + IC.md + '"/>' +
        '<rect x="21.8" y="16.6" width="16.4" height="29.6" rx="2.6" fill="' + IC.c + '"/>' +
        '<rect x="27.6" y="13.8" width="4.8" height="1.4" rx=".7" fill="' + IC.ml + '"/><rect x="26.5" y="48" width="7" height="1.6" rx=".8" fill="' + IC.ml + '"/>' +
        '<rect x="24.4" y="19.6" width="11.2" height="8.4" rx="1.6" fill="' + IC.ml + '"/>' +
        '<rect x="24.4" y="30.6" width="11.2" height="2.2" rx="1.1" fill="' + IC.ml + '"/><rect x="24.4" y="34.8" width="7.6" height="2.2" rx="1.1" fill="' + IC.ml + '"/>' +
        '<circle cx="44.6" cy="21" r="9" fill="' + IC.p + '"/><path d="M38.8 26.4L36.4 31.2L42.2 28.4Z" fill="' + IC.p + '"/>' +
        heart(44.6, 21.3, 0.22, '#FFFFFF'));
    },
    'tf': function () { // TF팀: 로켓
      return team(line('M14 46L19.5 40.5M18.4 50.4L23 45.8M12.4 40L16.8 35.6', IC.md, 2.4) +
        '<g transform="rotate(45 32 32)">' +
        '<path d="M28 38Q32 53 36 38Z" fill="' + IC.p + '"/><path d="M29.6 38Q32 47 34.4 38Z" fill="' + IC.pl + '"/>' +
        '<path d="M24.6 31L18.4 39.4V42.6L25 39Z" fill="' + IC.md + '"/><path d="M39.4 31L45.6 39.4V42.6L39 39Z" fill="' + IC.md + '"/>' +
        '<path d="M32 9.5C39 15.4 41 24.6 40.2 38.6H23.8C23 24.6 25 15.4 32 9.5Z" fill="' + IC.m + '"/>' +
        '<path d="M32 9.5C35.4 12.4 37.6 16 38.7 20H25.3C26.4 16 28.6 12.4 32 9.5Z" fill="' + IC.p + '"/>' +
        '<circle cx="32" cy="27" r="4.4" fill="' + IC.c + '"/><circle cx="32" cy="27" r="2.6" fill="' + IC.ml + '"/></g>');
    },
    'admin': function () { // 총무팀: 지갑과 영수증
      return team('<rect x="22" y="9.5" width="20" height="24" rx="2.4" fill="#FFFFFF"/>' +
        '<rect x="25.5" y="14.5" width="13" height="2.4" rx="1.2" fill="' + IC.ml + '"/><rect x="25.5" y="19.5" width="9" height="2.4" rx="1.2" fill="' + IC.ml + '"/>' +
        '<rect x="12.5" y="24" width="39" height="29" rx="6.5" fill="' + IC.m + '"/>' +
        '<path d="M12.5 30.5a6.5 6.5 0 0 1 6.5-6.5h26a6.5 6.5 0 0 1 6.5 6.5v1.5h-39Z" fill="' + IC.md + '"/>' +
        '<rect x="37.5" y="35" width="14" height="10.5" rx="5.2" fill="' + IC.md + '"/><circle cx="43.4" cy="40.2" r="2.7" fill="' + IC.p + '"/>' +
        '<circle cx="22.5" cy="44.5" r="6.6" fill="' + IC.p + '"/>' + heart(22.5, 44.8, 0.15, '#FFFFFF'));
    },
    'contest': function () { // 연구대회팀: 트로피
      return team('<path d="M21.5 18H17a1.6 1.6 0 0 0-1.6 1.6c0 5.2 3.2 8.8 8.4 9.4" fill="none" stroke="' + IC.pd + '" stroke-width="3.2" stroke-linecap="round"/>' +
        '<path d="M42.5 18H47a1.6 1.6 0 0 1 1.6 1.6c0 5.2-3.2 8.8-8.4 9.4" fill="none" stroke="' + IC.pd + '" stroke-width="3.2" stroke-linecap="round"/>' +
        '<path d="M21 13.5h22v10.5a11 11 0 0 1-22 0Z" fill="' + IC.p + '"/>' +
        '<rect x="28.8" y="33.5" width="6.4" height="9" rx="1.6" fill="' + IC.md + '"/>' +
        '<rect x="21.5" y="42" width="21" height="9.5" rx="3.2" fill="' + IC.m + '"/><rect x="26" y="45.7" width="12" height="2.2" rx="1.1" fill="' + IC.ml + '"/>' +
        Pa(starD(32, 23.5, 6.6, 3), '#FFFFFF'));
    },
    'regional': function () { // 지역연구회: 접은 지도와 핀
      return team('<path d="M9.5 25L21.5 21L33.5 25L45.5 21V48L33.5 52L21.5 48L9.5 52Z" fill="' + IC.ml + '"/>' +
        '<path d="M21.5 21L33.5 25V52L21.5 48Z" fill="' + IC.m + '"/>' +
        '<path d="M13.5 45Q19 37.6 25 41.4T36 38" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 4.2" fill="none"/>' +
        '<path d="M43 9.5a9.5 9.5 0 0 1 9.5 9.5c0 7-9.5 17-9.5 17s-9.5-10-9.5-17a9.5 9.5 0 0 1 9.5-9.5Z" fill="' + IC.p + '"/>' +
        heart(43, 19.4, 0.19, '#FFFFFF'));
    }
  };

  // 2027 분과·팀. face = 대표 쿼카(아바타·카드 공방에 쓰인다)
  var GROUPS = [
    { key: 'ai-civic',      name: 'AI민주시민 분과', type: '분과', tone: 'mint',  face: { expression: 'think',   accessory: 'glasses' } },
    { key: 'physical-ai',   name: '피지컬AI 분과',   type: '분과', tone: 'pink',  face: { expression: 'idea',    accessory: 'goggles' } },
    { key: 'ai-media',      name: 'AI미디어 분과',   type: '분과', tone: 'mint',  face: { expression: 'excited', accessory: 'headphones' } },
    { key: 'ai-sel',        name: 'AI사회정서 분과', type: '분과', tone: 'pink',  face: { expression: 'happy',   accessory: 'blossom' } },
    { key: 'ai-dev',        name: 'AI개발 분과',     type: '분과', tone: 'mint',  face: { expression: 'focus',   accessory: 'cap' } },
    { key: 'ai-content',    name: 'AI콘텐츠 분과',   type: '분과', tone: 'pink',  face: { expression: 'idea',    accessory: 'beret:pink' } },
    { key: 'planning',      name: '기획운영팀',      type: '팀',   tone: 'lavender', face: { expression: 'smile',   accessory: 'pencil' } },
    { key: 'training-team', name: '연수팀',          type: '팀',   tone: 'lavender', face: { expression: 'smile',   accessory: 'mortarboard' } },
    { key: 'pr',            name: '홍보팀',          type: '팀',   tone: 'lavender', face: { expression: 'excited', accessory: 'sunglasses-up' } },
    { key: 'admin',         name: '총무팀',          type: '팀',   tone: 'lavender', face: { expression: 'focus',   accessory: 'glasses' } },
    { key: 'contest',       name: '연구대회팀',      type: '팀',   tone: 'lavender', face: { expression: 'excited', accessory: 'laurel' } },
    { key: 'tf',            name: '프로젝트 TF',     type: '팀',   tone: 'lavender', face: { expression: 'think',   accessory: 'hairband' } },
    { key: 'regional',      name: '지역연구회',      type: '팀',   tone: 'lavender', face: { expression: 'smile',   accessory: 'bucket' } }
  ];
  var TONE_BG = { mint: '#DDF5EC', pink: '#FFE3EC', lavender: '#ECE6FB', cream: '#ECE6FB' };
  function findGroup(q) {
    if (!q) return null;
    q = String(q).replace(/\s+/g, '');
    for (var i = 0; i < GROUPS.length; i++) {
      var g = GROUPS[i], n = g.name.replace(/\s+/g, '');
      if (g.key === q || n === q || n.replace(/분과$/, '') === q.replace(/분과$/, '')) return g;
    }
    return null;
  }

  // ── 데이터 ──────────────────────────────────────────────────────
  var BADGES = [
    { key: 'sprout',      title: '첫 발걸음',   desc: '첫 모임에 함께했어요' },
    { key: 'pencil',      title: '자료 나눔',   desc: '자료실에 자료를 올렸어요' },
    { key: 'bulb',        title: '수업 아이디어', desc: '수업 사례를 나눴어요' },
    { key: 'headset',     title: '연수 나눔',   desc: '연수 강사로 나섰어요' },
    { key: 'goggles',     title: '메이커',     desc: '해커톤·바이브코딩에 참여했어요' },
    { key: 'laurel',      title: '연구대회',   desc: '연구대회에 도전했어요' },
    { key: 'mortarboard', title: '함께 집필',   desc: '사례집·보고서를 함께 썼어요' },
    { key: 'ribbon',      title: '응원',       desc: '동료에게 응원을 열 번 건넸어요' }
  ];

  // 예시 일정이에요. 실제 일정으로 바꿔 쓰세요: el.months = [...]
  var ROADMAP_EXAMPLE = [
    { month: 1,  item: 'earmuffs',    title: '겨울 연수 준비',    desc: '방학 동안 함께 공부할 주제 고르기' },
    { month: 2,  item: 'mortarboard', title: '한 해 돌아보기',    desc: '사례집 마무리와 성찰 모임' },
    { month: 3,  item: 'sprout',      title: '연구 주제 정하기',   desc: '새 학기, 분과별 질문 세우기' },
    { month: 4,  item: 'blossom',     title: '분과 첫 모임',      desc: '얼굴 익히고 역할 나누기' },
    { month: 5,  item: 'carnation',   title: '서로 응원하는 달',   desc: '스승의 날, 동료에게 한마디' },
    { month: 6,  item: 'rainhat',     title: '수업 열기',        desc: '수업 공개와 동료 피드백' },
    { month: 7,  item: 'bucket',      title: '여름 집중 연수',    desc: 'AI융합 수업 설계 실습' },
    { month: 8,  item: 'sunglasses',  title: '해커톤',          desc: '선생님들이 직접 만드는 하루' },
    { month: 9,  item: 'pencil',      title: '2학기 적용',       desc: '여름에 만든 수업을 교실로' },
    { month: 10, item: 'beret',       title: '연구대회 준비',     desc: '기록을 모아 보고서로' },
    { month: 11, item: 'pom-beanie',  title: '사례 나눔 발표회',   desc: '한 해 수업을 함께 나누기' },
    { month: 12, item: 'snowflake',   title: '송년 모임',        desc: '결국 사람이 남는 자리' }
  ];

  var STATES = {
    empty:       { face: { expression: 'think', accessory: 'pom-beanie', motion: 'ponder' }, heading: '아직 글이 없어요', desc: '첫 글을 남겨 주시면 쿼카가 제일 먼저 읽을게요.' },
    loading:     { face: { expression: 'focus', accessory: 'headphones', motion: 'ponder' }, heading: '쿼카가 자료를 찾는 중이에요', desc: '잠시만 기다려 주세요.', dots: true },
    notfound:    { face: { expression: 'puzzled', accessory: 'glasses', motion: 'ponder' }, heading: '딱 맞는 자료가 아직 없어요', desc: '검색어를 줄이거나 다른 말로 찾아봐 주세요.' },
    error404:    { face: { expression: 'hmm', accessory: 'bucket', motion: 'ponder' }, heading: '길을 잃었나 봐요', desc: '주소가 바뀌었거나 사라진 페이지예요.' },
    done:        { face: { expression: 'excited', accessory: 'ribbon', motion: 'aha' }, heading: '잘 받았어요!', desc: '함께 나눠 주셔서 고마워요.' },
    maintenance: { face: { expression: 'focus', accessory: 'goggles', motion: 'ponder' }, heading: '쿼카가 손보는 중이에요', desc: '조금만 기다려 주세요. 금방 돌아올게요.' }
  };

  // ── 스타일(한 번만) ──────────────────────────────────────────────
  // ── 6-1. 아이콘 움직임 ──────────────────────────────────────────
  // 마우스를 올리거나(링크·버튼 안이면 그 링크에 올려도) .play()를 부르면 아이콘마다 뜻에 맞게 한 번 움직인다.
  // [시작, 끝, 동작, 기준점, 늦춤(초)] — 그림 조각 시작~끝을 한 묶음으로 움직인다.
  // 기준점이 'center bottom' 같은 말이면 그 묶음 상자 기준, [x, y]면 64칸 좌표.
  var IMO = {
    archive: [[1, 2, 'rise', [32, 22]]],
    training: [[4, 4, 'grow', 'center bottom'], [5, 5, 'grow', 'center bottom', 0.08], [6, 6, 'grow', 'center bottom', 0.16]],
    casebook: [[5, 5, 'swing', 'center top']],
    notice: [[0, 3, 'tilt', [24, 32]], [4, 4, 'pulse', 'left center', 0.1]],
    events: [[12, 12, 'beat', 'center']],
    community: [[0, 0, 'hop', 'center bottom', 0.12], [1, 1, 'hop', 'center bottom', 0.24], [2, 2, 'hop', 'center bottom']],
    search: [[0, 3, 'peek', 'center']],
    checkin: [[0, 1, 'beat', [32, 34]], [2, 4, 'pop', 'center', 0.15]],
    home: [[0, 6, 'hop', 'center bottom']],
    about: [[2, 3, 'wave', 'left center']],
    members: [[0, 1, 'hop', 'center bottom', 0.1], [2, 4, 'hop', 'center bottom']],
    join: [[2, 4, 'spin', 'center']],
    mypage: [[0, 7, 'tilt', 'center bottom']],
    message: [[3, 3, 'float', 'center']],
    qa: [[0, 3, 'hop', 'center bottom', 0.12], [4, 7, 'hop', 'center bottom']],
    gallery: [[0, 0, 'wiggle', 'center'], [1, 4, 'hop', 'center bottom', 0.08]],
    download: [[1, 2, 'drop', 'center']],
    upload: [[1, 2, 'rise', 'center']],
    document: [[0, 6, 'tilt', 'center bottom']],
    worksheet: [[6, 6, 'pop', 'center', 0.3], [8, 8, 'scribble', 'center']],
    slides: [[5, 6, 'spin', 'center']],
    video: [[1, 1, 'clap', 'left bottom']],
    data: [[0, 0, 'grow', 'center bottom'], [1, 1, 'grow', 'center bottom', 0.08], [2, 2, 'grow', 'center bottom', 0.16], [4, 4, 'twinkle', 'center', 0.2], [5, 5, 'twinkle', 'center', 0.3]],
    link: [[0, 0, 'wiggle', 'center']],
    certificate: [[5, 9, 'swing', 'center top']],
    trophy: [[0, 6, 'hop', 'center bottom']],
    mic: [[3, 4, 'wiggle', 'center bottom'], [5, 5, 'twinkle', 'center', 0.1]],
    ticket: [[0, 0, 'wiggle', 'center']],
    clock: [[0, 1, 'ring', 'center'], [6, 6, 'spin', [32, 34]]],
    location: [[1, 3, 'hop', 'center bottom']],
    coffee: [[4, 4, 'steam', 'center'], [5, 5, 'float', 'center', 0.2]],
    camera: [[0, 5, 'snap', 'center']],
    'ai-chat': [[2, 2, 'jump', 'center'], [3, 3, 'jump', 'center', 0.1], [4, 4, 'jump', 'center', 0.2], [5, 5, 'twinkle', 'center', 0.1], [6, 6, 'twinkle', 'center', 0.25]],
    sparkles: [[0, 0, 'twinkle', 'center'], [1, 1, 'twinkle', 'center', 0.12], [2, 2, 'twinkle', 'center', 0.24]],
    idea: [[0, 0, 'flash', 'center'], [1, 2, 'beat', 'center']],
    puzzle: [[0, 2, 'wiggle', 'center'], [3, 3, 'twinkle', 'center', 0.1]],
    plant: [[0, 2, 'sway', [32, 35]]],
    palette: [[1, 1, 'pop', 'center'], [2, 2, 'pop', 'center', 0.07], [3, 3, 'pop', 'center', 0.14], [4, 4, 'pop', 'center', 0.21], [5, 5, 'pop', 'center', 0.28]],
    globe: [[0, 3, 'wiggle', 'center'], [4, 4, 'float', 'center', 0.15]],
    game: [[3, 3, 'pop', 'center'], [4, 4, 'pop', 'center', 0.08], [5, 5, 'pop', 'center', 0.16], [6, 6, 'pop', 'center', 0.24]],
    bell: [[0, 1, 'swing', [32, 10]], [2, 3, 'pop', 'center', 0.2]],
    settings: [[0, 2, 'spin', 'center']],
    lock: [[0, 0, 'unlock', 'center']],
    news: [[0, 8, 'tilt', 'center bottom']],
    share: [[1, 1, 'pop', 'center'], [2, 2, 'pop', 'center', 0.1], [3, 3, 'pop', 'center', 0.2]],
    star: [[0, 5, 'starpop', [32, 33]]],
    bookmark: [[0, 1, 'hop', 'center bottom']],
    help: [[0, 4, 'spin', 'center']],
    // 분과·팀: 따로 정한 것만 적고, 나머지는 groupMotion이 채운다
    'ai-civic': [[2, 2, 'drop', 'center']],
    'ai-media': [[5, 5, 'pop', 'center']],
    planning: [[4, 5, 'pop', 'center'], [7, 8, 'pop', 'center', 0.12], [10, 10, 'pop', 'center', 0.24]],
    pr: [[8, 10, 'pop', 'center']],
    tf: [[2, 2, 'launch', 'center']],
    regional: [[4, 5, 'hop', 'center bottom']]
  };
  function groupMotion(key, n) { // 분과 = 그림이 통 튀고 AI 반짝이가 반짝, 팀 = 그림이 살짝 기운다
    var g = GROUPS.filter(function (x) { return x.key === key; })[0];
    if (!g) return IMO[key] || null;
    var div = g.type === '분과';
    var m = IMO[key] ? IMO[key].slice() : [[1, div ? n - 3 : n - 1, div ? 'hop' : 'tilt', 'center bottom']];
    if (div) m.push([n - 2, n - 2, 'twinkle', 'center', 0.15], [n - 1, n - 1, 'twinkle', 'center', 0.3]);
    return m;
  }
  function splitTop(s) { // 맨 바깥 조각들로 자른다(<g>·<svg> 안쪽은 한 조각)
    var out = [], d = 0, st = 0, re = /<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g, m;
    while ((m = re.exec(s))) {
      if (m[1]) { d--; if (d === 0) out.push(s.slice(st, re.lastIndex)); }
      else if (m[3]) { if (d === 0) out.push(s.slice(m.index, re.lastIndex)); }
      else { if (d === 0) st = m.index; d++; }
    }
    return out;
  }
  function addMotion(name, body) {
    var els = splitTop(body), spec = groupMotion(name, els.length);
    if (!spec) return body;
    var at = {};
    spec.forEach(function (m) { if (m[1] < els.length && m[0] <= m[1]) at[m[0]] = m; });
    var out = '', i = 0;
    while (i < els.length) {
      var m = at[i];
      if (!m) { out += els[i++]; continue; }
      var o = m[3], box = typeof o === 'string';
      out += '<g class="qmv' + (box ? ' fb' : '') + '" style="--qn:qi-' + m[2] + (m[4] ? ';--qd:' + m[4] + 's' : '') +
        ';transform-origin:' + (box ? o : o[0] + 'px ' + o[1] + 'px') + '">' + els.slice(i, m[1] + 1).join('') + '</g>';
      i = m[1] + 1;
    }
    return out;
  }
  var ICON_KEYFRAMES = {
    swing:   '0%{transform:rotate(0)}8%{transform:rotate(14deg)}16%{transform:rotate(-11deg)}24%{transform:rotate(7deg)}32%{transform:rotate(-3deg)}40%,100%{transform:rotate(0)}',
    ring:    '0%,40%,100%{transform:rotate(0)}5%,15%,25%{transform:rotate(-9deg)}10%,20%,30%{transform:rotate(9deg)}',
    drop:    '0%{transform:translateY(0)}14%{transform:translateY(5px)}26%{transform:translateY(-1.5px)}36%,100%{transform:translateY(0)}',
    rise:    '0%{transform:translateY(0)}14%{transform:translateY(-5px)}26%{transform:translateY(1px)}36%,100%{transform:translateY(0)}',
    beat:    '0%{transform:scale(1)}10%{transform:scale(1.2)}20%{transform:scale(.95)}30%{transform:scale(1.1)}40%,100%{transform:scale(1)}',
    pop:     '0%{transform:scale(1)}12%{transform:scale(.7)}26%{transform:scale(1.18)}38%,100%{transform:scale(1)}',
    spin:    '0%{transform:rotate(0)}40%,100%{transform:rotate(360deg)}',
    grow:    '0%{transform:scaleY(1)}6%{transform:scaleY(.3)}24%{transform:scaleY(1.1)}34%,100%{transform:scaleY(1)}',
    hop:     '0%{transform:translateY(0) scale(1,1)}8%{transform:translateY(1px) scale(1.06,.92)}20%{transform:translateY(-6px) scale(.96,1.05)}32%{transform:translateY(0) scale(1.04,.96)}40%,100%{transform:translateY(0) scale(1,1)}',
    wiggle:  '0%{transform:rotate(0)}8%{transform:rotate(-9deg)}16%{transform:rotate(8deg)}24%{transform:rotate(-5deg)}32%{transform:rotate(3deg)}40%,100%{transform:rotate(0)}',
    tilt:    '0%{transform:rotate(0)}14%{transform:translateY(-2px) rotate(-10deg)}28%{transform:rotate(4deg)}40%,100%{transform:rotate(0)}',
    twinkle: '0%{transform:scale(1) rotate(0)}12%{transform:scale(.3) rotate(-30deg)}26%{transform:scale(1.3) rotate(20deg)}40%,100%{transform:scale(1) rotate(0)}',
    clap:    '0%{transform:rotate(0)}10%{transform:rotate(-16deg)}18%{transform:rotate(0)}26%{transform:rotate(-9deg)}34%,100%{transform:rotate(0)}',
    steam:   '0%{transform:translateY(0);opacity:1}18%{transform:translateY(-6px);opacity:0}19%{transform:translateY(4px);opacity:0}36%,100%{transform:translateY(0);opacity:1}',
    float:   '0%{transform:translateY(0) scale(1)}18%{transform:translateY(-7px) scale(1.25)}40%,100%{transform:translateY(0) scale(1)}',
    unlock:  '0%{transform:translateY(0)}12%,26%{transform:translateY(-5px)}36%,100%{transform:translateY(0)}',
    peek:    '0%{transform:translate(0,0)}10%{transform:translate(-3px,-2px)}20%{transform:translate(3px,-2px)}30%{transform:translate(1px,2px)}40%,100%{transform:translate(0,0)}',
    flash:   '0%{opacity:1}10%{opacity:.15}20%{opacity:1}30%{opacity:.3}40%,100%{opacity:1}',
    sway:    '0%{transform:rotate(0)}12%{transform:rotate(-12deg)}24%{transform:rotate(9deg)}34%{transform:rotate(-3deg)}40%,100%{transform:rotate(0)}',
    scribble:'0%{transform:translate(0,0) rotate(0)}8%{transform:translate(-3px,2px) rotate(-4deg)}16%{transform:translate(2px,-1px) rotate(3deg)}24%{transform:translate(-2px,2px) rotate(-3deg)}32%{transform:translate(1px,0) rotate(1deg)}40%,100%{transform:translate(0,0) rotate(0)}',
    jump:    '0%,24%,100%{transform:translateY(0)}10%{transform:translateY(-4.5px)}',
    snap:    '0%{transform:scale(1)}10%{transform:scale(.9)}22%{transform:scale(1.06)}34%,100%{transform:scale(1)}',
    wave:    '0%{transform:skewY(0)}10%{transform:skewY(-7deg) scaleX(.94)}20%{transform:skewY(5deg)}30%{transform:skewY(-3deg)}40%,100%{transform:skewY(0)}',
    pulse:   '0%{transform:scale(1);opacity:1}14%{transform:scale(1.25);opacity:.35}28%{transform:scale(.95);opacity:1}40%,100%{transform:scale(1)}',
    starpop: '0%{transform:rotate(0) scale(1)}12%{transform:rotate(-15deg) scale(1.15)}26%{transform:rotate(10deg) scale(1.05)}40%,100%{transform:rotate(0) scale(1)}',
    launch:  '0%{transform:translate(0,0);opacity:1}16%{transform:translate(4px,-6px);opacity:1}24%{transform:translate(8px,-12px);opacity:0}25%{transform:translate(-6px,8px);opacity:0}38%,100%{transform:translate(0,0);opacity:1}'
  };
  var ICON_MOTION_CSS = Object.keys(ICON_KEYFRAMES).map(function (k) { return '@keyframes qi-' + k + '{' + ICON_KEYFRAMES[k] + '}'; }).join('\n');
  var ICON_MOTIONS = Object.keys(ICON_KEYFRAMES);

  var CSS = [
    '.qk{--_ink:var(--qk-ink,#24190F);--_muted:var(--qk-muted,#76685C);--_line:var(--qk-line,#E5DDD3);--_surface:var(--qk-surface,#FFFFFF);--_soft:var(--qk-soft,#F4F0EA);--_accent:var(--qk-accent,#C2507A);--_accent-soft:var(--qk-accent-soft,#FBE4EC);--_mint:var(--qk-mint,#48B096);color:var(--_ink)}',
    '.qk img{display:block;max-width:100%}',
    '.qk button{font:inherit;color:inherit}',
    '.qk :focus-visible{outline:2px solid var(--_accent);outline-offset:2px}',
    'quoka-avatar{display:inline-block;vertical-align:middle}',
    '.qk-av{border-radius:50%;overflow:hidden;display:grid;place-items:center}',
    '.qk-av img{width:106%;height:106%;margin-top:5%}',
    // state
    'quoka-state{display:block}',
    '.qk-state{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:28px 16px}',
    '.qk-state b{font-size:17px;font-weight:700}',
    '.qk-state p{margin:0;font-size:14px;color:var(--_muted);max-width:32ch;line-height:1.55}',
    '.qk-state .qk-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px}',
    '.qk-state.compact{flex-direction:row;text-align:left;gap:14px;padding:14px 4px}',
    '.qk-state.compact .qk-text{display:flex;flex-direction:column;gap:2px}',
    '.qk-dots{display:inline-flex;gap:3px;margin-left:6px;vertical-align:middle}',
    '.qk-dots i{width:4px;height:4px;border-radius:50%;background:var(--_accent);animation:qkdot 1.2s infinite}',
    '.qk-dots i:nth-child(2){animation-delay:.2s}.qk-dots i:nth-child(3){animation-delay:.4s}',
    '@keyframes qkdot{0%,60%,100%{opacity:.25}30%{opacity:1}}',
    // checkin
    'quoka-checkin{display:block}',
    '.qk-ci{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:1px;background:var(--_line);border:1px solid var(--_line);border-radius:16px;overflow:hidden}',
    '.qk-ci > div{background:var(--_surface);padding:20px;min-width:0;display:flex;flex-direction:column;gap:14px}',
    '.qk-ci h4,.qk-badges h4{margin:0;font-size:16px}',
    '.qk-ci .qk-now{display:flex;align-items:center;gap:14px}',
    '.qk-ci .qk-now img{width:112px;height:112px;background:var(--_soft);border-radius:50%}',
    '.qk-ci .qk-now b{font-size:20px;display:block}',
    '.qk-ci .qk-now small{color:var(--_muted);font-size:13px}',
    '.qk-moods{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}',
    '.qk-mood{border:1px solid var(--_line);background:var(--_surface);border-radius:12px;padding:6px 2px 8px;display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;font-size:11.5px;line-height:1.2;word-break:keep-all}',
    '.qk-mood img{width:44px;height:44px}',
    '.qk-mood[aria-pressed="true"]{border-color:var(--_accent);background:var(--_accent-soft);font-weight:700}',
    '.qk-cta{border:1px solid var(--_ink);background:var(--_ink);color:var(--_surface)!important;border-radius:999px;padding:8px 18px;font-size:14px;font-weight:600;cursor:pointer;align-self:flex-start}',
    '.qk-cta[disabled]{opacity:.4;cursor:default}',
    '.qk-cta.ghost{background:transparent;color:var(--_ink)!important}',
    '.qk-crowd{display:flex;flex-direction:column;gap:8px}',
    '.qk-crowd-row{display:grid;grid-template-columns:76px minmax(0,1fr) 28px;align-items:center;gap:8px;font-size:13px}',
    '.qk-crowd-row span{color:var(--_muted)}',
    '.qk-crowd-row .faces{display:flex;flex-wrap:wrap;gap:0}',
    '.qk-crowd-row .faces img{width:26px;height:26px;margin-right:-6px}',
    '.qk-crowd-row em{font-style:normal;font-variant-numeric:tabular-nums;text-align:right;color:var(--_muted)}',
    '.qk-note{font-size:13px;color:var(--_muted);border-top:1px solid var(--_line);padding-top:10px;margin:0}',
    // badges
    'quoka-badges{display:block}',
    '.qk-badges{display:grid;grid-template-columns:220px minmax(0,1fr);gap:1px;background:var(--_line);border:1px solid var(--_line);border-radius:16px;overflow:hidden}',
    '.qk-badges > div{background:var(--_surface);padding:20px;min-width:0}',
    '.qk-me{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center}',
    '.qk-me img{width:150px;height:150px;background:var(--_soft);border-radius:50%}',
    '.qk-me b{font-size:16px}.qk-me small{color:var(--_muted);font-size:13px}',
    '.qk-shelf{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}',
    '.qk-badge{border:1px solid var(--_line);background:var(--_surface);border-radius:14px;padding:10px 8px 12px;display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;cursor:pointer;min-width:0}',
    '.qk-badge img{width:72px;height:72px}',
    '.qk-badge b{font-size:13.5px}.qk-badge small{font-size:11.5px;color:var(--_muted);line-height:1.35;word-break:keep-all}',
    '.qk-badge.locked{cursor:default;background:var(--_soft)}',
    '.qk-badge.locked img{filter:grayscale(1);opacity:.35}',
    '.qk-badge.locked b{color:var(--_muted)}',
    '.qk-badge[aria-pressed="true"]{border-color:var(--_accent);box-shadow:inset 0 0 0 1px var(--_accent)}',
    // roadmap
    'quoka-roadmap{display:block}',
    '.qk-road{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(150px,1fr);gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 2px 12px}',
    '.qk-month{scroll-snap-align:start;border:1px solid var(--_line);background:var(--_surface);border-radius:14px;padding:12px 12px 14px;display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.qk-month .m{font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--_muted)}',
    '.qk-month img{width:84px;height:84px;align-self:center;margin:2px 0 4px}',
    '.qk-month b{font-size:14px;line-height:1.35;word-break:keep-all}',
    '.qk-month small{font-size:12px;color:var(--_muted);line-height:1.45;word-break:keep-all}',
    '.qk-month.past{opacity:.6}',
    '.qk-month.now{border-color:var(--_accent);background:var(--_accent-soft)}',
    '.qk-month.now .m{color:var(--_accent)}',
    // icon
    'quoka-icon{display:inline-block;vertical-align:middle;line-height:0;position:relative}',
    'quoka-icon svg{display:block;width:100%;height:100%;overflow:visible;transition:transform .25s cubic-bezier(.3,1.6,.5,1)}',
    '.qk-iconlink:hover quoka-icon svg,quoka-icon:hover svg{transform:translateY(-2px) scale(1.05)}',
    'quoka-icon .qmv{transform-box:view-box}quoka-icon .qmv.fb{transform-box:fill-box}',
    'quoka-icon:hover .qmv,quoka-icon.qi-play .qmv,quoka-icon[animate=loop] .qmv,a:hover quoka-icon .qmv,a:focus-visible quoka-icon .qmv,button:hover quoka-icon .qmv,button:focus-visible quoka-icon .qmv,.qk-iconlink:hover quoka-icon .qmv,[data-qi-hover]:hover quoka-icon .qmv{animation:var(--qn) 2s cubic-bezier(.35,0,.25,1) var(--qd,0s) 1 both}',
    'quoka-icon[animate=loop] .qmv{animation-iteration-count:infinite}',
    'quoka-icon[animate=none] .qmv{animation:none!important}',
    ICON_MOTION_CSS,
    '.qi-badge{position:absolute;top:-8%;right:-12%;min-width:1.6em;height:1.6em;padding:0 .42em;box-sizing:border-box;border-radius:999px;background:var(--qk-badge,#C2416F);color:#fff;font-family:inherit;font-weight:800;line-height:1.6em;text-align:center;letter-spacing:-.02em;box-shadow:0 0 0 2px var(--qk-surface,#fff);pointer-events:none;font-variant-numeric:tabular-nums}',
    '.qi-badge.dot{min-width:0;width:.85em;height:.85em;padding:0;top:0;right:0}',
    '.qi-badge.sm{top:-30%;right:-40%;box-shadow:0 0 0 1.5px var(--qk-surface,#fff)}.qi-badge.sm.dot{top:-6%;right:-10%;width:1em;height:1em}',
    '.qi-badge.qi-new{animation:qi-badge .5s cubic-bezier(.3,1.6,.5,1)}@keyframes qi-badge{0%{transform:scale(0)}100%{transform:scale(1)}}',
    // nav
    'quoka-nav{display:block}',
    '.qk-nav{display:flex;align-items:center;gap:6px;background:var(--_surface);border:1px solid var(--_line);border-radius:18px;padding:7px 8px;position:relative;box-sizing:border-box}',
    '.qk-nav-brand{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;color:var(--_ink);text-decoration:none;padding:2px 12px 2px 2px;margin-right:2px;white-space:nowrap;flex:none;border-right:1px solid var(--_line)}',
    '.qk-nav-list{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;flex:1;min-width:0}',
    '.qk-nav-list::-webkit-scrollbar{display:none}',
    '.qk-nav-item{display:flex;align-items:center;gap:7px;padding:7px 12px 7px 8px;border-radius:12px;color:var(--_muted);text-decoration:none;font:inherit;font-size:14px;font-weight:600;white-space:nowrap;position:relative;transition:background .2s,color .2s,transform .2s,box-shadow .2s,border-color .2s;flex:none;border:0;background:none;cursor:pointer}',
    '.qk-nav-item .ic{display:grid;place-items:center;line-height:0}',
    '.qk-nav-item:hover{background:var(--_soft);color:var(--_ink)}',
    '.qk-nav-item[aria-current="page"]{background:var(--_accent-soft);color:var(--_accent);font-weight:800}',
    '.qk-nav.top .qk-nav-more{display:none}',
    '.qk-nav.tab{position:var(--qk-nav-pos,fixed);left:0;right:0;bottom:0;z-index:50;border-radius:20px 20px 0 0;border-width:1px 0 0;padding:5px 4px calc(5px + env(safe-area-inset-bottom));box-shadow:0 -6px 24px rgba(60,30,40,.08)}',
    '.qk-nav.tab .qk-nav-list{overflow:visible;justify-content:space-around}',
    '.qk-nav.tab .qk-nav-item{flex:1 1 0;min-width:0;flex-direction:column;gap:2px;padding:4px 0 3px;font-size:11px;background:none}',
    '.qk-nav.tab .qk-nav-item .ic{width:56px;max-width:100%;height:32px;border-radius:999px;transition:background .25s}',
    '.qk-nav.tab .qk-nav-item[aria-current="page"] .ic,.qk-nav.tab .qk-nav-more.has-active .ic{background:var(--_accent-soft)}',
    '.qk-nav.tab .qk-nav-item[aria-current="page"]{background:none}',
    '.qk-nav.tab .qk-nav-list > .qk-nav-item.extra{display:none}',
    '.qk-nav-item .lb{overflow:hidden;text-overflow:ellipsis;max-width:100%}',
    '.qk-more-ic{display:block;width:26px;height:26px;position:relative}.qk-more-ic svg{display:block;width:100%;height:100%}',
    '.qk-more-dot{position:absolute;top:-1px;right:-3px;width:8px;height:8px;border-radius:50%;background:var(--qk-badge,#C2416F);box-shadow:0 0 0 1.5px var(--qk-surface,#fff)}.qk-more-dot[hidden]{display:none}',
    '.qk-nav-sheet{position:absolute;left:8px;right:8px;bottom:calc(100% + 8px);background:var(--_surface);border:1px solid var(--_line);border-radius:18px;padding:10px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;box-shadow:0 12px 32px rgba(60,30,40,.16)}',
    '.qk-nav-sheet[hidden]{display:none}',
    '.qk-nav-sheet .qk-nav-item{flex-direction:column;gap:4px;padding:10px 2px 8px;font-size:12px;white-space:normal;text-align:center;word-break:keep-all}',
    '.qk-nav.grid{display:block;background:none;border:0;padding:0}',
    '.qk-nav.grid .qk-nav-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px;overflow:visible}',
    '.qk-nav.grid .qk-nav-item{flex-direction:column;gap:8px;padding:16px 8px 14px;background:var(--_surface);border:1px solid var(--_line);border-radius:18px;color:var(--_ink);font-size:13.5px;white-space:normal;text-align:center;word-break:keep-all}',
    '.qk-nav.grid .qk-nav-item:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(60,30,40,.08);background:var(--_surface)}',
    '.qk-nav.grid .qk-nav-item[aria-current="page"]{border-color:var(--_accent);background:var(--_accent-soft)}',
    // guide
    'quoka-guide{display:block}',
    '.qk-guide{display:flex;align-items:flex-end;gap:10px}',
    '.qk-guide-face{flex:none;line-height:0;margin-bottom:-4px}',
    '.qk-bubble{position:relative;flex:1;min-width:0;background:var(--_surface);border:1px solid var(--_line);border-radius:18px 18px 18px 6px;padding:14px 16px 12px;box-shadow:0 8px 24px rgba(60,30,40,.07)}',
    '.qk-bubble::before{content:"";position:absolute;left:-7px;bottom:14px;width:12px;height:12px;background:var(--_surface);border-left:1px solid var(--_line);border-bottom:1px solid var(--_line);transform:rotate(45deg)}',
    '.qk-say{margin:0;font-size:15px;line-height:1.65;min-height:3.3em;word-break:keep-all;padding-right:18px}',
    '.qk-say .cur{display:inline-block;width:2px;height:1.05em;background:var(--_accent);vertical-align:-3px;margin-left:2px;animation:qkcur .8s steps(1) infinite}@keyframes qkcur{50%{opacity:0}}',
    '.qk-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;margin:0}',
    '.qk-guide-bar{display:flex;align-items:center;gap:6px;margin-top:10px}',
    '.qk-guide-bar .n{font-size:12px;color:var(--_muted);margin-right:auto;font-variant-numeric:tabular-nums}',
    '.qk-gbtn{font:inherit;font-size:13px;font-weight:700;border-radius:999px;padding:7px 14px;border:1px solid var(--_line);background:var(--_surface);color:var(--_ink);cursor:pointer}',
    '.qk-gbtn.go{background:var(--_accent);border-color:var(--_accent);color:#fff}',
    '.qk-gbtn[disabled]{opacity:.4;cursor:default}',
    '.qk-guide-x{position:absolute;top:6px;right:6px;width:30px;height:30px;border-radius:50%;border:0;background:transparent;color:var(--_muted);cursor:pointer;font-size:20px;line-height:1}',
    '.qk-guide-x:hover{background:var(--_soft)}',
    '.qk-guide-open{display:none}',
    'quoka-guide[floating]{position:var(--qk-guide-pos,fixed);right:16px;bottom:16px;z-index:60;width:min(380px,calc(100vw - 32px))}',
    'quoka-guide[floating][minimized]{width:auto}',
    'quoka-guide[floating][minimized] .qk-guide{display:none}',
    'quoka-guide[floating][minimized] .qk-guide-open{display:grid;place-items:center;width:64px;height:64px;border-radius:50%;border:1px solid var(--_line);background:var(--_surface);box-shadow:0 8px 24px rgba(60,30,40,.18);cursor:pointer;padding:0;transition:transform .2s}',
    '.qk-guide-open:hover{transform:translateY(-3px)}',
    '.qk-spot{outline:3px solid var(--qk-accent,#C2507A)!important;outline-offset:6px;border-radius:14px;animation:qkspot 1.4s ease-out 2}',
    '@keyframes qkspot{0%{outline-offset:16px;outline-color:rgba(194,80,122,0)}45%{outline-offset:6px;outline-color:var(--qk-accent,#C2507A)}}',
    // login
    'quoka-login{display:block}',
    '.qk-login{display:flex;flex-direction:column;gap:12px;max-width:360px;margin:0 auto;background:var(--_surface);border:1px solid var(--_line);border-radius:22px;padding:18px 22px 20px;box-sizing:border-box}',
    '.qk-login-face{align-self:center;line-height:0;margin-bottom:-6px}',
    '.qk-login h4{margin:0 0 2px;text-align:center;font-size:17px}',
    '.qk-field{display:flex;flex-direction:column;gap:6px}',
    '.qk-field label{font-size:13px;font-weight:700;color:var(--_muted)}',
    '.qk-field input{font:inherit;font-size:15px;color:var(--_ink);border:1.5px solid var(--_line);border-radius:12px;padding:11px 12px;background:var(--_surface);width:100%;box-sizing:border-box;transition:border-color .2s,box-shadow .2s}',
    '.qk-field input:focus{outline:none;border-color:var(--_accent);box-shadow:0 0 0 4px var(--_accent-soft)}',
    '.qk-pw{position:relative}.qk-pw input{padding-right:48px}',
    '.qk-eye{position:absolute;right:5px;top:50%;transform:translateY(-50%);width:38px;height:38px;border:0;border-radius:10px;background:transparent;color:var(--_muted);cursor:pointer;display:grid;place-items:center}',
    '.qk-eye:hover{background:var(--_soft);color:var(--_ink)}',
    '.qk-login-msg{margin:0;min-height:1.4em;font-size:13.5px;color:var(--_muted);text-align:center}',
    '.qk-login-msg.err{color:var(--_accent);font-weight:700}.qk-login-msg.ok{color:#2F7F68;font-weight:700}',
    '.qk-login .qk-cta{width:100%;justify-content:center}',
    '.qk-login-foot{display:flex;justify-content:center;flex-wrap:wrap;gap:6px 14px;font-size:13px;color:var(--_muted)}',
    '.qk-login-foot a{color:var(--_muted)}',
    '.qk-login.shake{animation:qkshake .42s}@keyframes qkshake{20%{transform:translateX(-7px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(2px)}}',
    // nav: side
    '.qk-nav.side{flex-direction:column;align-items:stretch;gap:2px;padding:14px 10px 12px;height:100%;border-radius:20px}',
    '.qk-nav.side .qk-nav-brand{border-right:0;border-bottom:1px solid var(--_line);padding:2px 6px 14px;margin:0 0 8px;gap:10px;font-size:15.5px;line-height:1.25;white-space:normal}',
    '.qk-nav-brand small{display:block;font-size:11.5px;font-weight:600;color:var(--_muted);letter-spacing:.02em}',
    '.qk-nav.side .qk-nav-list{flex-direction:column;overflow:visible;flex:none;gap:2px}',
    '.qk-nav.side .qk-nav-item{padding:8px 12px 8px 8px;font-size:14.5px;gap:10px;border-radius:12px}',
    '.qk-nav.side .qk-nav-item quoka-icon svg{transition:filter .2s}',
    '.qk-nav.side .qk-nav-item:not([aria-current]):not(:hover) quoka-icon svg{filter:saturate(.25) opacity(.8)}',
    '.qk-nav.side .qk-nav-item[aria-current="page"]{background:var(--_accent-soft);color:var(--_accent)}',
    '.qk-nav-sec{font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--_muted);padding:14px 12px 4px}',
    '.qk-nav .qk-nav-cta{margin:12px 2px 6px;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 12px;border-radius:14px;background:var(--_ink);color:var(--_surface);font:inherit;font-size:14px;font-weight:700;border:0;cursor:pointer;text-decoration:none;transition:transform .2s}',
    '.qk-nav-cta span{font-size:18px;line-height:1;font-weight:500}',
    '.qk-nav-cta:hover{transform:translateY(-2px)}',
    '.qk-nav.side .qk-nav-bottom{margin-top:auto;border-top:1px solid var(--_line);padding-top:8px}',
    // tabs
    'quoka-tabs{display:block;min-width:0}',
    '.qk-tabs{position:relative;min-width:0}',
    '.qk-tabs-track{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding:4px;background:var(--_soft);border-radius:14px;scroll-behavior:auto}',
    '.qk-tabs-track::-webkit-scrollbar{display:none}',
    '.qk-tabs.l .qk-tabs-track{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 48px);mask-image:linear-gradient(90deg,transparent 0,#000 48px)}',
    '.qk-tabs.r .qk-tabs-track{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 48px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 48px),transparent)}',
    '.qk-tabs.l.r .qk-tabs-track{-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 48px,#000 calc(100% - 48px),transparent);mask-image:linear-gradient(90deg,transparent 0,#000 48px,#000 calc(100% - 48px),transparent)}',
    '.qk-tabs .qk-tab{flex:none;display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border:0;border-radius:10px;background:transparent;color:var(--_muted);font:inherit;font-size:14px;font-weight:600;white-space:nowrap;cursor:pointer;transition:background .2s,color .2s,box-shadow .2s}',
    '.qk-tab:hover{color:var(--_ink)}',
    '.qk-tab[aria-selected="true"]{background:var(--_surface);color:var(--_ink);font-weight:800;box-shadow:0 1px 3px rgba(40,20,30,.1),0 0 0 1px var(--_line)}',
    '.qk-tab .n{font-size:11.5px;font-weight:700;min-width:20px;padding:1px 6px;border-radius:999px;background:var(--_surface);color:var(--_muted);text-align:center;font-variant-numeric:tabular-nums}',
    '.qk-tab[aria-selected="true"] .n{background:var(--_accent-soft);color:var(--_accent)}',
    '.qk-tabs.stretch .qk-tab{flex:1 1 0;justify-content:center}',
    '.qk-tabs-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:1;width:30px;height:30px;border-radius:50%;border:1px solid var(--_line);background:var(--_surface);color:var(--_ink);font-size:20px;line-height:1;cursor:pointer;display:none;place-items:center;box-shadow:0 2px 8px rgba(40,20,30,.1)}',
    '.qk-tabs-arrow.prev{left:-6px}.qk-tabs-arrow.next{right:-6px}',
    '.qk-tabs.l .qk-tabs-arrow.prev,.qk-tabs.r .qk-tabs-arrow.next{display:grid}',
    // type chip
    '.qk-type{display:inline-flex;align-items:center;gap:6px;padding:1px 10px 1px 8px;border-radius:999px;background:color-mix(in srgb,var(--c) 11%,transparent);color:var(--_ink);font-size:12px;font-weight:700;white-space:nowrap;line-height:1.7}',
    '.qk-type i{width:7px;height:7px;border-radius:50%;background:var(--c);flex:none}',
    // event
    'quoka-event{display:block}',
    '.qk-ev{background:var(--_surface);border:1px solid var(--_line);border-radius:18px;overflow:hidden;transition:box-shadow .2s,border-color .2s}',
    '.qk-ev:hover{box-shadow:0 8px 22px rgba(40,20,30,.07)}',
    '.qk-ev.open{border-color:color-mix(in srgb,var(--_ink) 22%,var(--_line))}',
    '.qk-ev-head{display:grid;grid-template-columns:58px minmax(0,1fr) auto 22px;gap:14px;align-items:center;width:100%;padding:14px 16px 14px 14px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}',
    '.qk-ev-date{display:flex;flex-direction:column;align-items:center;justify-content:center;width:58px;height:62px;border-radius:16px;background:var(--_soft);line-height:1.1}',
    '.qk-ev-date small{font-size:11px;font-weight:700;color:var(--_muted)}',
    '.qk-ev-date[hidden]{display:none}',
    '.qk-ev-date b{font-size:22px;font-weight:800;font-variant-numeric:tabular-nums;margin:1px 0}',
    '.qk-ev-main{display:flex;flex-direction:column;gap:5px;min-width:0}',
    '.qk-ev-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
    '.qk-ev-st{font-size:12px;font-weight:700;color:var(--_muted)}',
    '.qk-ev-st.open{color:var(--qk-ok,#2E9E7C)}.qk-ev-st.soon{color:#6B4FC0}',
    '.qk-ev-dd{font-size:11.5px;font-weight:700;color:var(--_muted);border:1px solid var(--_line);border-radius:999px;padding:0 8px;font-variant-numeric:tabular-nums;line-height:1.6}',
    '.qk-ev-title{font-size:16px;font-weight:800;line-height:1.4;word-break:keep-all}',
    '.qk-ev-meta{font-size:12.5px;color:var(--_muted)}',
    '.qk-ev-side{display:flex;flex-direction:column;align-items:flex-end;gap:5px;min-width:96px}',
    '.qk-ev-num,.qk-ev-conf{white-space:nowrap}',
    '.qk-ev-num b{font-size:20px;font-weight:800;font-variant-numeric:tabular-nums}.qk-ev-num small{font-size:12px;color:var(--_muted);font-weight:600;margin-left:1px}',
    '.qk-ev-bar{display:flex;gap:2px;width:96px;height:6px;border-radius:999px;background:var(--_soft);overflow:hidden}',
    '.qk-ev-bar i{display:block;height:100%;border-radius:999px}.qk-ev-bar .cf{background:var(--qk-ok,#2E9E7C)}.qk-ev-bar .wt{background:color-mix(in srgb,var(--qk-ok,#2E9E7C) 35%,transparent)}',
    '.qk-ev-conf{font-size:11.5px;color:var(--_muted);font-variant-numeric:tabular-nums}',
    '.qk-ev-chev{width:22px;height:22px;border-radius:50%;background:var(--_soft);position:relative;transition:transform .25s}',
    '.qk-ev-chev::before{content:"";position:absolute;left:7.5px;top:6px;width:6px;height:6px;border-right:2px solid var(--_muted);border-bottom:2px solid var(--_muted);transform:rotate(45deg)}',
    '.qk-ev.open .qk-ev-chev{transform:rotate(180deg)}',
    '.qk-ev-head.link{cursor:pointer}.qk-ev-head.link:hover .qk-ev-title{text-decoration:underline;text-underline-offset:3px}',
    '.qk-ev-head.still:not(.link){cursor:default}.qk-ev-head.still{grid-template-columns:58px minmax(0,1fr) auto}.qk-ev-head.still .qk-ev-chev{display:none}',
    '@media (max-width:640px){.qk-ev-head.still{grid-template-columns:52px minmax(0,1fr)}}',
    '.qk-ev.past .qk-ev-date{filter:grayscale(.7);opacity:.7}.qk-ev.past .qk-ev-title{color:var(--_muted)}',
    '.qk-ev-body{border-top:1px dashed var(--_line);padding:14px 16px 16px}',
    '@media (max-width:640px){.qk-ev-head{grid-template-columns:52px minmax(0,1fr) 22px;gap:10px}.qk-ev-date{width:52px;height:56px}.qk-ev-side{grid-column:2;grid-row:2;flex-direction:row;align-items:center;justify-content:flex-start;gap:10px;min-width:0}.qk-ev-chev{grid-column:3;grid-row:1}}',
    // calendar
    'quoka-calendar{display:block}',
    '.qk-cal{background:var(--_surface);border:1px solid var(--_line);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:12px}',
    '.qk-cal-head{display:flex;align-items:center;gap:12px}',
    '.qk-cal-head img{flex:none;width:52px;height:52px}',
    '.qk-cal-title{display:flex;flex-direction:column;flex:1;min-width:0;line-height:1.25}',
    '.qk-cal-title b{font-size:20px;font-weight:800}.qk-cal-title small{font-size:12.5px;color:var(--_muted)}',
    '.qk-cal-nav{display:flex;gap:4px}',
    '.qk-cal-btn{min-width:34px;height:34px;border-radius:10px;border:1px solid var(--_line);background:var(--_surface);color:var(--_ink);font:inherit;font-size:18px;cursor:pointer}',
    '.qk-cal-btn.txt{font-size:13px;font-weight:700;padding:0 12px}',
    '.qk-cal-btn:hover{background:var(--_soft)}',
    '.qk-cal-legend{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;color:var(--_muted)}',
    '.qk-cal-legend span{display:inline-flex;align-items:center;gap:6px}.qk-cal-legend i{width:8px;height:8px;border-radius:3px}',
    '.qk-cal-grid{display:flex;flex-direction:column;border:1px solid var(--_line);border-radius:14px;overflow:hidden;background:var(--_line);gap:1px}',
    '.qk-cal-row{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:1px}',
    '.qk-cal-row.wd span{background:var(--_soft);font-size:12px;font-weight:700;color:var(--_muted);text-align:center;padding:7px 0}',
    '.qk-cal-row.wd .sun{color:#C2416F}.qk-cal-row.wd .sat{color:#6E57C7}',
    '.qk-cal-day{background:var(--_surface);border:0;min-height:92px;padding:6px 6px 8px;text-align:left;display:flex;flex-direction:column;gap:4px;font:inherit;color:inherit;cursor:pointer;min-width:0;position:relative}',
    '.qk-cal-day:hover{background:var(--_soft)}',
    '.qk-cal-day .num{font-size:13px;font-weight:700;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;font-variant-numeric:tabular-nums}',
    '.qk-cal-day.sun .num{color:#C2416F}.qk-cal-day.sat .num{color:#6E57C7}',
    '.qk-cal-day.out{background:var(--_soft)}.qk-cal-day.out .num{opacity:.4}',
    '.qk-cal-day.today .num{background:var(--_ink);color:var(--_surface)!important}',
    '.qk-cal-day.sel{box-shadow:inset 0 0 0 2px var(--_accent);z-index:1}',
    '.qk-cal-day .evs{display:flex;flex-direction:column;gap:3px;min-width:0}',
    '.qk-cal-day .ev{display:block;font-size:11.5px;font-weight:600;line-height:1.35;padding:2px 6px 2px 7px;border-radius:6px;background:color-mix(in srgb,var(--c) 10%,transparent);box-shadow:inset 2.5px 0 0 var(--c);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.qk-cal-day .more{font-size:11px;color:var(--_muted);font-weight:700;padding-left:4px}',
    '.qk-cal-day .dots{display:none;gap:3px;padding-left:4px}.qk-cal-day .dots i{width:6px;height:6px;border-radius:50%}',
    '.qk-cal.compact .qk-cal-day{min-height:54px;align-items:center;padding:5px 2px}',
    '.qk-cal.compact .qk-cal-title b{font-size:17px}.qk-cal.compact .qk-cal-head img{width:44px;height:44px}.qk-cal.compact .qk-cal-btn{min-width:30px;height:30px}.qk-cal.compact .qk-cal-btn.txt{padding:0 9px}',
    '.qk-cal.compact .qk-cal-day .evs{display:none}.qk-cal.compact .qk-cal-day .dots{display:flex;padding:0}',
    '.qk-cal-agenda{border-top:1px solid var(--_line);padding-top:12px}',
    '.qk-cal-day-h{margin:0 0 8px;display:flex;gap:8px;align-items:center;font-size:14px}',
    '.qk-cal-day-h span{font-size:11px;font-weight:800;color:var(--_accent);background:var(--_accent-soft);border-radius:6px;padding:1px 7px}',
    '.qk-cal-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.qk-cal-list li{display:block}',
    '.qk-cal .qk-cal-item{display:grid;grid-template-columns:auto minmax(0,1fr);gap:2px 10px;align-items:center;width:100%;padding:10px 12px;border-radius:12px;background:var(--_soft);border:0;font:inherit;color:inherit;text-align:left;cursor:pointer}',
    '.qk-cal .qk-cal-item:hover{background:color-mix(in srgb,var(--c) 10%,var(--_soft))}',
    '.qk-cal-list b{font-size:14px;word-break:keep-all}.qk-cal-list small{grid-column:2;font-size:12px;color:var(--_muted)}',
    '.qk-cal-empty{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--_muted)}',
    // stat
    'quoka-stat{display:block;min-width:0}',
    '.qk-stat{display:flex;flex-direction:column;gap:2px;padding:14px 16px;border-radius:16px;background:var(--_surface);border:1px solid var(--_line);height:100%;box-sizing:border-box}',
    '.qk-stat quoka-icon{margin-bottom:6px}',
    '.qk-stat .v b{font-size:28px;font-weight:800;line-height:1.15;font-variant-numeric:tabular-nums;letter-spacing:-.01em}',
    '.qk-stat .v small{font-size:13px;font-weight:700;color:var(--_muted);margin-left:2px}',
    '.qk-stat .l{font-size:13px;color:var(--_muted);font-weight:600}',
    '.qk-stat .d{display:flex;align-items:center;gap:3px;font-size:12px;font-weight:800;margin-top:4px}',
    '.qk-stat .d i{font-style:normal;font-size:9px}.qk-stat .d.up{color:#2F7F68}.qk-stat .d.down{color:#C2416F}',
    '.qk-stat .d small{font-weight:500;color:var(--_muted);margin-left:4px}',
    '.qk-stat.hl{border-color:color-mix(in srgb,var(--_accent) 45%,transparent);box-shadow:inset 0 3px 0 var(--_accent)}.qk-stat.hl .v b{color:var(--_accent)}',
    // bars
    'quoka-bars{display:block}',
    '.qk-bars{margin:0;display:flex;flex-direction:column;gap:10px;position:relative}',
    '.qk-bars figcaption{font-size:14px;font-weight:800}',
    '.qk-bars-plot{position:relative;height:190px;padding-left:30px}',
    '.qk-bars-grid{position:absolute;inset:0 0 22px 30px;display:flex;flex-direction:column;justify-content:space-between}',
    '.qk-bars-grid span{display:block;border-top:1px solid var(--_line);position:relative}',
    '.qk-bars-grid em{position:absolute;right:calc(100% + 6px);top:-8px;font-style:normal;font-size:11px;color:var(--_muted);font-variant-numeric:tabular-nums}',
    '.qk-bars-cols{position:absolute;inset:0 0 0 30px;display:flex;gap:2px;align-items:stretch}',
    '.qk-bar{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:0;cursor:pointer;padding-bottom:22px;position:relative}',
    '.qk-bar .b{position:relative;width:min(26px,70%);background:color-mix(in srgb,var(--_ink) 16%,transparent);border-radius:4px 4px 0 0;transform-origin:bottom;transition:transform .7s cubic-bezier(.2,.8,.2,1),background .2s;transition-delay:calc(var(--i) * 35ms);min-height:2px}',
    '.qk-bar .b em{position:absolute;bottom:calc(100% + 3px);left:50%;transform:translateX(-50%);font-style:normal;font-size:11.5px;font-weight:800;color:var(--_ink);font-variant-numeric:tabular-nums}',
    '.qk-bar small{position:absolute;bottom:0;font-size:11px;color:var(--_muted);white-space:nowrap}',
    '.qk-bar:hover .b{filter:brightness(.92)}',
    '.qk-bar.hl .b{background:var(--_accent)}.qk-bar.hl small{color:var(--_ink);font-weight:800}',
    '.qk-bars.pre .qk-bar .b{transform:scaleY(0)}',
    '.qk-bars-tip{position:absolute;top:-6px;background:var(--_ink);color:var(--_surface);font-size:12px;padding:6px 10px;border-radius:8px;white-space:nowrap;pointer-events:none;z-index:2}',
    '.qk-bars-tip small{display:block;opacity:.75}',
    // toast
    '.qk-toasts{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;width:max-content;max-width:calc(100vw - 32px)}',
    '.qk-toast{pointer-events:auto;display:flex;align-items:center;gap:10px;background:var(--_ink);color:var(--_surface);border-radius:16px;padding:8px 14px 8px 8px;font-size:14px;font-weight:600;box-shadow:0 10px 30px rgba(20,10,30,.25);animation:qktoast .28s cubic-bezier(.2,.9,.3,1.2)}',
    '.qk-toast img{width:28px;height:28px;border-radius:50%;background:var(--_surface)}',
    '.qk-toast button{border:0;background:none;color:inherit;font:inherit;font-weight:800;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:0 0 0 6px}',
    '.qk-toast.out{opacity:0;transform:translateY(8px);transition:.2s}',
    '@keyframes qktoast{from{opacity:0;transform:translateY(12px) scale(.96)}}',
    // sheet
    'quoka-sheet{display:contents}',
    '.qk-sheet{border:0;padding:0;margin:0 0 0 auto;width:min(440px,100%);height:100%;max-height:100%;background:var(--_surface);color:var(--_ink);box-shadow:-20px 0 50px rgba(20,10,30,.18);overflow:auto}',
    '.qk-sheet[open]{animation:qksheet .26s cubic-bezier(.2,.8,.2,1)}',
    '@keyframes qksheet{from{transform:translateX(30px);opacity:0}}',
    '.qk-sheet::backdrop{background:rgba(20,16,30,.36)}',
    '.qk-sheet-head{position:sticky;top:0;display:flex;align-items:center;gap:10px;padding:18px 20px 12px;background:var(--_surface);z-index:1}',
    '.qk-sheet-head h3{margin:0;font-size:19px;flex:1;line-height:1.35}',
    '.qk .qk-sheet-x{width:36px;height:36px;border-radius:50%;border:0;background:var(--_soft);color:var(--_muted);font-size:20px;line-height:1;cursor:pointer;flex:none}',
    '.qk-sheet-body{padding:4px 20px 24px}',
    '@media (max-width:720px){.qk-sheet{margin:auto 0 0;width:100%;max-width:100%;height:auto;max-height:88vh;border-radius:24px 24px 0 0}.qk-sheet[open]{animation-name:qksheetup}@keyframes qksheetup{from{transform:translateY(30px);opacity:0}}}',
    // post
    'quoka-post{display:block}',
    '.qk-post{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 4px;border-bottom:1px solid var(--_line)}',
    '.qk-post.pinned{background:var(--_soft);border-radius:14px;padding:12px;border-bottom:0;margin-bottom:6px}',
    '.qk-post-main{display:flex;flex-direction:column;gap:2px;min-width:0;color:inherit;text-decoration:none}',
    'a.qk-post-main:hover b{text-decoration:underline;text-underline-offset:3px}',
    '.qk-post-top{display:flex;gap:6px}.qk-post-top .pin{font-size:11.5px;font-weight:800;color:var(--_accent)}.qk-post-top .cat{font-size:12px;font-weight:600;color:var(--_muted)}',
    '.qk-post-main b{font-size:15px;line-height:1.4;word-break:keep-all;display:flex;align-items:center;gap:6px}',
    '.qk-post-main .new{width:6px;height:6px;border-radius:50%;background:var(--_accent);flex:none}',
    '.qk-post-main .ex{font-size:13px;color:var(--_muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.qk-post-main small{font-size:12.5px;color:var(--_muted)}',
    '.qk-post-side{display:flex;gap:4px;align-items:center;color:var(--_muted);font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}',
    '.qk-post-side .cm,.qk-post-side .lk{display:inline-flex;align-items:center;gap:4px;padding:6px 8px;border-radius:10px}',
    '.qk-post-side .lk{border:0;background:none;color:inherit;font:inherit;cursor:pointer}',
    '.qk-post-side .lk:hover{background:var(--_soft)}.qk-post-side .lk.on{color:var(--_accent)}',
    '.qk-post-side .lk.on svg{animation:qkheart .4s cubic-bezier(.3,1.6,.5,1)}@keyframes qkheart{50%{transform:scale(1.35)}}',
    // file
    'quoka-file{display:block}',
    '.qk-file{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 4px;border-bottom:1px solid var(--_line)}',
    '.qk-file-t span{display:grid;place-items:center;width:44px;height:52px;border-radius:10px 16px 10px 10px;color:#fff;font-size:11px;font-weight:800;letter-spacing:.04em;position:relative}',
    '.qk-file-t span::after{content:"";position:absolute;top:0;right:0;width:12px;height:12px;background:rgba(255,255,255,.35);border-radius:0 14px 0 6px}',
    '.qk-file-main{display:flex;flex-direction:column;gap:2px;min-width:0}',
    '.qk-file-main b{font-size:15px;line-height:1.4;word-break:break-all}',
    '.qk-file-main small{font-size:12.5px;color:var(--_muted)}',
    '.qk-file-main .tags{display:flex;flex-wrap:wrap;gap:4px 8px;margin-top:2px}.qk-file-main .tags i{font-style:normal;font-size:12px;color:var(--_accent);font-weight:600}',
    '.qk .qk-file-get{display:inline-flex;flex-direction:column;align-items:center;gap:1px;font-size:11.5px;font-weight:700;color:var(--_muted);text-decoration:none;border:0;background:none;cursor:pointer;padding:6px 8px;border-radius:12px;font-family:inherit}',
    '.qk-file-get:hover{background:var(--_soft);color:var(--_ink)}',
    // member
    'quoka-member{display:block}',
    '.qk-member{display:grid;grid-template-columns:56px minmax(0,1fr);gap:4px 14px;padding:16px;border:1px solid var(--_line);border-radius:18px;background:var(--_surface);height:100%;box-sizing:border-box}',
    '.qk-member-main{display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.qk-member-main b{font-size:16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.qk-member-main .role{font-size:11.5px;font-weight:800;color:var(--_accent);background:var(--_accent-soft);border-radius:999px;padding:0 8px}',
    '.qk-member-main .grp{display:flex;align-items:center;gap:4px;font-size:13px;color:var(--_muted);font-weight:600}',
    '.qk-member-main p{margin:2px 0 0;font-size:13.5px;line-height:1.5;word-break:keep-all}',
    '.qk-member-main .tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:2px}.qk-member-main .tags i{font-style:normal;font-size:12px;background:var(--_soft);border-radius:999px;padding:1px 9px;color:var(--_muted);font-weight:600}',
    '.qk-member-ct{grid-column:1 / -1;display:flex;align-items:center;gap:8px;border-top:1px dashed var(--_line);padding-top:10px;margin-top:6px;font-size:13px;color:var(--_muted)}',
    '.qk-member-ct .num{font-variant-numeric:tabular-nums;font-weight:600;color:var(--_ink)}',
    '.qk-member-ct .lock{display:flex;align-items:center;gap:6px}',
    '.qk-member-ct button{margin-left:auto;border:1px solid var(--_line);background:var(--_surface);border-radius:999px;padding:3px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;color:var(--_ink)}',
    // poll
    'quoka-poll{display:block}',
    '.qk-poll{display:flex;flex-direction:column;gap:10px;border:1px solid var(--_line);border-radius:20px;padding:18px;background:var(--_surface)}',
    '.qk-poll h4{margin:0;font-size:17px}.qk-poll-sub{margin:0;font-size:13px;color:var(--_muted)}',
    '.qk-poll-list{display:flex;flex-direction:column;gap:6px}',
    '.qk-poll-opt{position:relative;overflow:hidden;display:flex;align-items:center;gap:10px;width:100%;border:1.5px solid var(--_line);background:var(--_surface);border-radius:14px;padding:11px 14px;font:inherit;font-size:14.5px;color:var(--_ink);cursor:pointer;text-align:left}',
    '.qk-poll-opt:hover:not(:disabled){border-color:var(--_muted)}',
    '.qk-poll-opt[aria-pressed="true"]{border-color:var(--_accent);background:var(--_accent-soft)}',
    '.qk-poll-opt .mk{width:18px;height:18px;border-radius:50%;border:2px solid var(--_line);flex:none;position:relative;z-index:1;background:var(--_surface)}',
    '.qk-poll-opt[aria-pressed="true"] .mk{border-color:var(--_accent);box-shadow:inset 0 0 0 3px var(--_surface);background:var(--_accent)}',
    '.qk-poll-opt .t{position:relative;z-index:1;flex:1;font-weight:600}',
    '.qk-poll-opt .fill{position:absolute;inset:0 auto 0 0;background:var(--_soft);transition:width .6s cubic-bezier(.2,.8,.2,1)}',
    '.qk-poll-opt.top .fill{background:color-mix(in srgb,var(--_accent) 16%,transparent)}',
    '.qk-poll-opt.res{background:var(--_surface);border-color:var(--_line)}.qk-poll-opt.res .mk{display:none}',
    '.qk-poll-opt.mine{border-color:var(--_accent)}',
    '.qk-poll-opt .faces{position:relative;z-index:1;display:flex}.qk-poll-opt .faces img{width:22px;height:22px;margin-left:-6px;border-radius:50%;background:var(--_surface)}',
    '.qk-poll-opt .p{position:relative;z-index:1;font-weight:800;font-variant-numeric:tabular-nums;min-width:40px;text-align:right}',
    '.qk-poll-opt:disabled{cursor:default}',
    '.qk-poll .qk-cta{align-self:flex-start}',
    '.qk-poll .qk-cta:disabled{opacity:.45;cursor:default}',
    // countdown
    'quoka-countdown{display:block}',
    '.qk-cd{display:flex;align-items:center;gap:16px;border:1px solid var(--_line);border-radius:22px;padding:16px 18px;background:var(--_surface)}',
    '.qk-cd img{flex:none}',
    '.qk-cd-main{display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.qk-cd-main .ttl{font-size:14px;font-weight:700;color:var(--_muted);word-break:keep-all}',
    '.qk-cd-main .dd{font-size:34px;line-height:1.05;font-weight:800;color:var(--_accent);font-variant-numeric:tabular-nums;letter-spacing:-.02em}',
    '.qk-cd-main .units{display:flex;gap:6px;flex-wrap:wrap}',
    '.qk-cd-main .units span{display:flex;align-items:baseline;gap:2px;background:var(--_soft);border-radius:10px;padding:3px 8px}',
    '.qk-cd-main .units b{font-size:16px;font-variant-numeric:tabular-nums}.qk-cd-main .units small{font-size:11px;color:var(--_muted);font-weight:600}',
    '.qk-cd-main .units .thx{background:none;padding:0;font-size:14px;font-weight:700}',
    '.qk-cd-main > small{font-size:12.5px;color:var(--_muted)}',
    // faq
    '.qk-faq{display:flex;flex-direction:column;gap:8px}',
    '.qk-faq details{border:1px solid var(--_line);border-radius:16px;background:var(--_surface);overflow:hidden}',
    '.qk-faq details[hidden]{display:none}',
    '.qk-faq summary{list-style:none;cursor:pointer;padding:14px 44px 14px 16px;font-weight:700;font-size:15px;position:relative;word-break:keep-all}',
    '.qk-faq summary::-webkit-details-marker{display:none}',
    '.qk-faq summary::before{content:"Q";color:var(--_accent);font-weight:800;margin-right:8px}',
    '.qk-faq summary::after{content:"";position:absolute;right:18px;top:50%;width:8px;height:8px;border-right:2px solid var(--_muted);border-bottom:2px solid var(--_muted);transform:translateY(-70%) rotate(45deg);transition:transform .2s}',
    '.qk-faq details[open] summary::after{transform:translateY(-30%) rotate(-135deg)}',
    '.qk-faq-a{display:flex;gap:10px;align-items:flex-start;padding:0 16px 16px}',
    '.qk-faq-a img{flex:none;border-radius:50%;background:var(--_soft)}',
    '.qk-faq-a > div{background:var(--_soft);border-radius:4px 16px 16px 16px;padding:10px 14px;font-size:14px;line-height:1.6;word-break:keep-all;flex:1}',
    '.qk-faq-a > div > *{margin:0}.qk-faq-a > div > * + *{margin-top:6px}',
    '.qk-faq-find{display:flex;align-items:center;gap:8px;border:1px solid var(--_line);border-radius:14px;padding:0 12px;background:var(--_surface);height:46px}',
    '.qk-faq-find input{border:0;outline:none;background:none;flex:1;min-width:0;font:inherit;font-size:15px;color:var(--_ink)}',
    '.qk-faq-none{margin:4px 0 0;font-size:14px;color:var(--_muted)}',
    // ── 1.7 홈페이지 기본 조각 ──
    // hero
    'quoka-hero{display:block}',
    '.qk-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:32px;align-items:center;padding:clamp(28px,5vw,64px) clamp(20px,4vw,52px);border-radius:28px;background:var(--qk-hero-bg,var(--_surface));border:1px solid var(--_line)}',
    '.qk-hero-copy{display:flex;flex-direction:column;align-items:flex-start;gap:16px;min-width:0}',
    '.qk-hero-eye{margin:0;font-size:13.5px;font-weight:700;color:var(--_accent)}',
    '.qk-hero-h{margin:0;font-size:clamp(32px,4.8vw,54px);line-height:1.18;letter-spacing:-.02em;word-break:keep-all;text-wrap:balance}',
    '.qk-hero-h em{font-style:normal;color:var(--_accent)}',
    '.qk-hero-sub{margin:0;font-size:clamp(15px,1.5vw,17px);line-height:1.7;color:var(--_muted);max-width:44ch;word-break:keep-all}',
    '.qk-hero-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}',
    '.qk .qk-hero-btn{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 26px;border-radius:16px;font:inherit;font-size:16px;font-weight:700;text-decoration:none;cursor:pointer;border:1px solid var(--_ink);background:var(--_ink);color:var(--_surface);transition:transform .15s}',
    '.qk .qk-hero-btn.ghost{background:var(--_surface);color:var(--_ink);border-color:var(--_line)}',
    '.qk .qk-hero-btn.ghost:hover{border-color:var(--_muted)}',
    '.qk-hero-btn:active{transform:scale(.97)}',
    '.qk-hero-extra{margin-top:6px;font-size:13.5px;color:var(--_muted)}',
    '.qk-hero-fig{display:grid;place-items:center;min-width:0}',
    '.qk-hero-stage{position:relative;width:min(340px,100%);aspect-ratio:1;border-radius:50%;background:var(--_accent-soft);display:grid;place-items:center}',
    '.qk-hero-stage quoka-face{width:76%!important;height:76%!important}',
    '.qk-hero-orb{position:absolute;display:grid;place-items:center;width:62px;height:62px;border-radius:20px;background:var(--_surface);border:1px solid var(--_line);box-shadow:0 8px 22px rgba(30,20,40,.08);animation:qkorb 5.6s ease-in-out infinite;animation-delay:var(--d)}',
    '.qk-hero-orb.o0{left:-3%;top:4%}.qk-hero-orb.o1{right:-5%;top:16%}.qk-hero-orb.o2{right:1%;bottom:1%}.qk-hero-orb.o3{left:-7%;bottom:18%}',
    '@keyframes qkorb{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}',
    '.qk-hero.center{grid-template-columns:minmax(0,1fr);text-align:center;justify-items:center}',
    '.qk-hero.center .qk-hero-copy{align-items:center}.qk-hero.center .qk-hero-btns{justify-content:center}.qk-hero.center .qk-hero-fig{order:-1}.qk-hero.center .qk-hero-stage{width:min(230px,70%)}',
    '@media (max-width:720px){.qk-hero{grid-template-columns:minmax(0,1fr);gap:22px;border-radius:22px}.qk-hero-fig{order:-1}.qk-hero-stage{width:min(220px,62vw)}.qk-hero-orb{width:46px;height:46px;border-radius:15px}.qk-hero-orb quoka-icon{zoom:.78}.qk-hero-btns{width:100%}.qk .qk-hero-btn{flex:1 1 auto}}',
    // banner
    'quoka-banner{display:block}quoka-banner[hidden]{display:none}',
    '.qk-banner{display:flex;align-items:center;gap:10px;padding:8px 10px 8px 12px;border-radius:16px;font-size:14.5px;line-height:1.5;transition:opacity .25s,transform .25s}',
    '.qk-banner.accent{background:var(--_accent-soft);color:var(--_ink)}',
    '.qk-banner.soft{background:var(--_soft);color:var(--_ink)}',
    '.qk-banner.ink{background:var(--_ink);color:var(--_surface)}',
    '.qk-banner .ic{flex:none;display:grid;place-items:center;width:30px;height:30px}',
    '.qk-banner .tx{margin:0;flex:1;min-width:0;font-weight:600;word-break:keep-all}',
    '.qk-banner .go{flex:none;display:inline-flex;align-items:center;gap:2px;font-weight:700;font-size:14px;color:var(--_accent);text-decoration:none;padding:6px 8px;border-radius:10px;white-space:nowrap}',
    '.qk-banner.ink .go{color:var(--_surface);text-decoration:underline;text-underline-offset:3px}',
    '.qk-banner .go:hover{background:color-mix(in srgb,currentColor 10%,transparent)}',
    '.qk .qk-banner .x{flex:none;width:32px;height:32px;border:0;border-radius:50%;background:transparent;font-size:22px;line-height:1;cursor:pointer;color:inherit;opacity:.6}',
    '.qk .qk-banner .x:hover{opacity:1;background:color-mix(in srgb,currentColor 10%,transparent)}',
    '.qk-banner.bye{opacity:0;transform:translateY(-6px)}',
    '@media (max-width:520px){.qk-banner{flex-wrap:wrap;row-gap:2px}.qk-banner .tx{flex-basis:calc(100% - 84px)}.qk-banner .go{order:3;margin-left:30px;padding:2px 8px}}',
    // features
    'quoka-features{display:block}',
    '.qk-feats{display:grid;grid-template-columns:repeat(var(--cols,3),minmax(0,1fr));gap:12px}',
    '.qk .qk-feat{display:flex;flex-direction:column;gap:8px;padding:22px 20px;border-radius:22px;background:var(--_surface);border:1px solid var(--_line);color:var(--_ink);text-decoration:none;transition:transform .2s,box-shadow .2s;min-width:0}',
    'a.qk-feat:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(30,20,40,.07)}',
    '.qk-feat .ic{width:58px;height:58px;border-radius:18px;background:var(--_soft);display:grid;place-items:center;margin-bottom:6px}',
    '.qk-feat b{font-size:18px;line-height:1.35;word-break:keep-all}',
    '.qk-feat p{margin:0;font-size:14.5px;line-height:1.65;color:var(--_muted);word-break:keep-all}',
    '.qk-feat .more{margin-top:auto;padding-top:6px;font-size:14px;font-weight:700;color:var(--_accent);display:inline-flex;align-items:center;gap:2px}',
    '@media (max-width:860px){.qk-feats{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '@media (max-width:540px){.qk-feats{grid-template-columns:minmax(0,1fr);gap:8px}.qk .qk-feat{display:grid;grid-template-columns:52px minmax(0,1fr);column-gap:14px;row-gap:2px;padding:16px;border-radius:18px}.qk-feat .ic{grid-row:1 / span 3;width:52px;height:52px;border-radius:16px;margin:0}.qk-feat .ic quoka-icon{zoom:.85}.qk-feat b{font-size:16px}.qk-feat .more{padding-top:2px}}',
    // timeline
    'quoka-timeline{display:block;container:qktl / inline-size}',
    '.qk-tl{list-style:none;margin:0;padding:0;position:relative;display:flex;flex-direction:column;gap:4px}',
    '.qk-tl::before{content:"";position:absolute;left:25px;top:30px;bottom:30px;width:2px;background:var(--_line);border-radius:2px}',
    '.qk-tl-item{display:grid;grid-template-columns:52px minmax(0,1fr);grid-template-areas:"f d" "f b";column-gap:16px;align-items:start;position:relative;padding:8px 0}',
    '.qk-tl-item > img{grid-area:f;justify-self:center;border-radius:50%;background:var(--_surface);box-shadow:0 0 0 4px var(--_surface),0 0 0 5px var(--_line)}',
    '.qk-tl-item.now > img{box-shadow:0 0 0 4px var(--_surface),0 0 0 6px var(--_accent)}',
    '.qk-tl-item > .dt{grid-area:d;padding-top:2px;font-size:13px;font-weight:700;color:var(--_accent);font-variant-numeric:tabular-nums;display:flex;align-items:center;gap:6px}',
    '.qk-tl-item > .dt i{font-style:normal;font-size:11px;background:var(--_accent);color:var(--_surface);border-radius:999px;padding:0 7px;line-height:1.7}',
    '.qk-tl-body{grid-area:b;display:flex;flex-direction:column;gap:2px;min-width:0}',
    '.qk-tl-body b{font-size:17px;line-height:1.4;word-break:keep-all}',
    '.qk-tl-body p{margin:2px 0 0;font-size:14.5px;line-height:1.65;color:var(--_muted);word-break:keep-all}',
    '@container qktl (min-width:600px){.qk-tl-item{grid-template-columns:120px 52px minmax(0,1fr);grid-template-areas:"d f b"}.qk-tl-item > .dt{justify-content:flex-end;padding-top:12px}.qk-tl::before{left:161px}.qk-tl-body{padding-top:9px}}',
    '.qk-tl.anim .qk-tl-item{opacity:0;transform:translateY(12px)}',
    '.qk-tl.anim .qk-tl-item.in{opacity:1;transform:none;transition:opacity .5s,transform .5s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--k,0) * 90ms)}',
    // gallery
    'quoka-gallery{display:block}',
    '.qk-gal{display:grid;grid-template-columns:repeat(var(--cols,3),minmax(0,1fr));gap:12px 10px}',
    '.qk .qk-gal-tile{display:flex;flex-direction:column;gap:6px;border:0;background:none;padding:0;cursor:zoom-in;text-align:left;min-width:0;border-radius:16px}',
    '.qk-gal-tile[hidden]{display:none}',
    '.qk-gal-tile .fr{position:relative;display:block;overflow:hidden;border-radius:16px;background:var(--_soft);aspect-ratio:4 / 3}',
    '.qk-gal-tile img{width:100%;height:100%;object-fit:cover;display:block;transition:filter .2s}',
    '.qk-gal-tile:hover img{filter:brightness(.93)}',
    '.qk-gal-tile .cap{font-size:13.5px;font-weight:600;word-break:keep-all;padding:0 2px}',
    '.qk-veil{position:absolute;left:-999px;border-radius:50%;transform:translate(-50%,-50%);-webkit-backdrop-filter:blur(14px) saturate(.7);backdrop-filter:blur(14px) saturate(.7);background:color-mix(in srgb,var(--_soft) 28%,transparent);pointer-events:none}',
    '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.qk-veil{background:var(--_soft)}}',
    '.qk-gal:not(.veiled) .qk-veil{display:none}',
    '.qk-gal-foot{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px}.qk-gal-foot:empty{display:none}',
    '.qk-gal-note{display:flex;align-items:center;gap:6px;margin:0 auto 0 0;font-size:12.5px;color:var(--_muted)}',
    '.qk-gal-note[hidden]{display:none}',
    '@media (max-width:640px){.qk-gal{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 8px}.qk-gal-tile .fr{border-radius:12px}}',
    // lightbox
    '.qk-lb{border:0;padding:0;margin:0;width:100%;max-width:100%;height:100%;max-height:100%;background:transparent;color:#fff;overflow:hidden}',
    '.qk-lb::backdrop{background:rgba(14,12,18,.95)}',
    '.qk-lb[open]{display:flex;flex-direction:column;animation:qklb .2s ease-out}',
    '@keyframes qklb{from{opacity:0}}',
    '.qk-lb-top{display:flex;align-items:center;justify-content:space-between;padding:12px 14px 6px 20px;font-size:14px;font-variant-numeric:tabular-nums;color:rgba(255,255,255,.78)}',
    '.qk.qk-lb .x,.qk.qk-lb .nav{width:46px;height:46px;border-radius:50%;border:0;background:rgba(255,255,255,.12);color:#fff;font-size:28px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0}',
    '.qk.qk-lb .x:hover,.qk.qk-lb .nav:hover{background:rgba(255,255,255,.24)}',
    '.qk-lb .x:focus-visible,.qk-lb .nav:focus-visible{outline:2px solid #fff;outline-offset:2px}',
    '.qk-lb-stage{flex:1;display:grid;grid-template-columns:64px minmax(0,1fr) 64px;align-items:center;justify-items:center;min-height:0;padding:0 8px}',
    '.qk-lb .fr{position:relative;display:block;overflow:hidden;border-radius:12px;touch-action:pan-y}',
    '.qk-lb .fr img{display:block;max-width:100%;max-height:calc(100vh - 150px);max-height:calc(100dvh - 150px);width:auto;height:auto;user-select:none;-webkit-user-drag:none}',
    '.qk-lb .cap{margin:0;padding:10px 20px calc(18px + env(safe-area-inset-bottom));text-align:center;font-size:15px;color:rgba(255,255,255,.9);min-height:1.5em;word-break:keep-all}',
    '.qk-lb.one .nav{visibility:hidden}',
    '@media (max-width:640px){.qk-lb-stage{grid-template-columns:minmax(0,1fr);padding:0}.qk.qk-lb .nav{display:none}.qk-lb .fr{border-radius:0}}',
    // photo blur
    'quoka-photo-blur{display:block}',
    '.qk-pb{display:flex;flex-direction:column;gap:14px;border:1px solid var(--_line);border-radius:22px;background:var(--_surface);padding:18px}',
    '.qk-pb-head{display:flex;align-items:center;gap:12px}',
    '.qk-pb-head .m{flex:none;border-radius:50%;background:var(--_soft)}',
    '.qk-pb-head .say{margin:0;background:var(--_soft);border-radius:4px 16px 16px 16px;padding:10px 14px;font-size:14.5px;line-height:1.55;word-break:keep-all;flex:1}',
    '.qk-pb-pick{position:relative;display:flex;align-self:flex-start}',
    '.qk-pb-pick input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}',
    '.qk-pb-pick span{display:inline-flex;align-items:center;gap:6px;border:1.5px dashed var(--_line);border-radius:14px;padding:9px 16px 9px 10px;font-size:14px;background:var(--_surface)}',
    '.qk-pb-pick:hover span,.qk-pb-pick input:focus-visible + span{border-color:var(--_accent)}',
    '.qk-pb-stage{display:grid;place-items:center;background:var(--_soft);border-radius:16px;padding:10px}',
    '.qk-pb-stage[hidden],.qk-pb-bar[hidden],.qk-pb-out[hidden]{display:none}',
    '.qk-pb-stage .fr{position:relative;display:block;cursor:crosshair;border-radius:10px;overflow:hidden;line-height:0}',
    '.qk-pb-stage .ph{display:block;max-width:100%;max-height:440px;width:auto;height:auto;user-select:none;-webkit-user-drag:none}',
    '.qk-veil.mark{box-shadow:0 0 0 2px #fff,0 0 0 3.5px var(--_accent)}',
    '.qk-pb-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
    '.qk-pb-bar .sz{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--_muted)}',
    '.qk-pb-bar .sz input{accent-color:var(--_accent);width:120px}',
    '.qk-pb-bar .ct{margin-right:auto;font-size:13px;font-weight:700;color:var(--_accent)}',
    '.qk-pb-bar .qk-cta{align-self:auto}',
    '.qk-pb-out{display:flex;flex-direction:column;gap:10px;border-top:1px dashed var(--_line);padding-top:14px}',
    '.qk-pb-out img{max-width:100%;max-height:360px;width:auto;border-radius:12px;align-self:flex-start}',
    '.qk-pb-out .row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}',
    '.qk-pb-out .qk-cta{text-decoration:none;align-self:auto}',
    '.qk-pb-out small{font-size:12.5px;color:var(--_muted);flex:1;min-width:200px;word-break:keep-all}',
    // contact
    'quoka-contact{display:block;container:qkct / inline-size}',
    '.qk-ct{border:1px solid var(--_line);border-radius:24px;background:var(--_surface);padding:clamp(18px,3vw,28px);display:flex;flex-direction:column;gap:20px}',
    '.qk-ct-head{display:flex;align-items:center;gap:14px}',
    '.qk-ct-head quoka-face{flex:none}',
    '.qk-ct-head h3{margin:0;font-size:20px;line-height:1.3;word-break:keep-all}',
    '.qk-ct-head p{margin:2px 0 0;font-size:13.5px;color:var(--_muted)}',
    '.qk-ct form{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}',
    '.qk-ct form[hidden],.qk-ct-done[hidden],.qk-ct-fail[hidden]{display:none}',
    '@container qkct (min-width:560px){.qk-ct form{grid-template-columns:repeat(2,minmax(0,1fr))}.qk-ct .wide{grid-column:1 / -1}}',
    '.qk-ct-f{display:flex;flex-direction:column;gap:6px;min-width:0}',
    '.qk-ct-f > span,.qk-ct-topics legend{font-size:13px;font-weight:700;color:var(--_muted)}',
    '.qk-ct-f input,.qk-ct-f textarea{font:inherit;font-size:15.5px;color:var(--_ink);background:var(--_soft);border:1.5px solid transparent;border-radius:14px;padding:12px 14px;width:100%;box-sizing:border-box;transition:border-color .2s,background .2s}',
    '.qk-ct-f textarea{min-height:132px;resize:vertical;line-height:1.6}',
    '.qk-ct-f input:focus,.qk-ct-f textarea:focus{outline:none;border-color:var(--_accent);background:var(--_surface)}',
    '.qk-ct-f.bad input,.qk-ct-f.bad textarea{border-color:var(--qk-danger,#C93D63);background:var(--_surface)}',
    '.qk-ct-err{font-style:normal;font-size:12.5px;font-weight:700;color:var(--qk-danger,#C93D63)}.qk-ct-err:empty{display:none}',
    '.qk-ct-cnt{align-self:flex-end;font-size:12px;color:var(--_muted);font-variant-numeric:tabular-nums;margin-top:-2px}.qk-ct-cnt.full{color:var(--qk-danger,#C93D63);font-weight:700}',
    '.qk-ct-topics{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px;min-width:0}',
    '.qk-ct-topics legend{padding:0;margin-bottom:8px;float:left;width:100%}',
    '.qk-ct-topics label{position:relative;display:flex}',
    '.qk-ct-topics input{position:absolute;opacity:0;width:1px;height:1px;margin:0}',
    '.qk-ct-topics span{display:inline-flex;align-items:center;min-height:40px;padding:0 15px;border-radius:999px;border:1.5px solid var(--_line);font-size:14px;font-weight:600;cursor:pointer;color:var(--_muted);transition:border-color .15s,color .15s}',
    '.qk-ct-topics span:hover{border-color:var(--_muted)}',
    '.qk-ct-topics input:checked + span{border-color:var(--_ink);color:var(--_ink);background:var(--_soft)}',
    '.qk-ct-topics input:focus-visible + span{outline:2px solid var(--_accent);outline-offset:2px}',
    '.qk-ct-ok{display:flex;flex-direction:column;gap:8px;background:var(--_soft);border-radius:16px;padding:13px 15px;border:1.5px solid transparent}',
    '.qk-ct-ok.bad{border-color:var(--qk-danger,#C93D63);background:var(--_surface)}',
    '.qk-ct-ok .chk{display:flex;align-items:center;gap:10px;font-size:14.5px;font-weight:700;cursor:pointer;word-break:keep-all}',
    '.qk-ct-ok .chk input{width:20px;height:20px;accent-color:var(--_accent);margin:0;flex:none}',
    '.qk-ct-ok .chk em{font-style:normal;color:var(--_accent);font-size:12.5px}',
    '.qk-ct-ok details{font-size:13px;color:var(--_muted);padding-left:30px}',
    '.qk-ct-ok summary{cursor:pointer;font-weight:600;width:max-content;max-width:100%}',
    '.qk-ct-ok dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 12px;margin:8px 0}',
    '.qk-ct-ok dt{font-weight:700;color:var(--_ink)}.qk-ct-ok dd{margin:0;word-break:keep-all}',
    '.qk-ct-ok p{margin:0;word-break:keep-all}',
    '.qk-ct-hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}',
    '.qk-ct-fail{margin:0;background:color-mix(in srgb,var(--qk-danger,#C93D63) 10%,transparent);color:var(--_ink);border-radius:12px;padding:10px 14px;font-size:14px;font-weight:600}',
    '.qk-ct-send{display:flex;align-items:center;gap:14px;flex-wrap:wrap}',
    '.qk .qk-ct-go{min-height:52px;padding:0 30px;border-radius:16px;border:0;background:var(--_ink);color:var(--_surface);font:inherit;font-size:16px;font-weight:700;cursor:pointer;transition:transform .15s}',
    '.qk-ct-go:active{transform:scale(.97)}.qk-ct-go[disabled]{opacity:.5;cursor:default}',
    '.qk-ct-send small{font-size:12.5px;color:var(--_muted);flex:1;min-width:180px;word-break:keep-all}',
    '.qk-ct-done{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:12px 0 6px;outline:none}',
    '.qk-ct-done b{font-size:20px}.qk-ct-done p{margin:0 0 6px;color:var(--_muted);font-size:14.5px;overflow-wrap:anywhere}',
    '@container qkct (max-width:420px){.qk .qk-ct-go{width:100%}}',
    // footer
    'quoka-footer{display:block;container:qkft / inline-size}',
    '.qk-ft{position:relative;background:var(--qk-footer-bg,var(--_soft));border-radius:24px 24px 0 0;padding:clamp(24px,4vw,40px) clamp(18px,4vw,40px) 20px;display:flex;flex-direction:column;gap:26px;margin-top:48px}',
    '.qk-ft-peek{position:absolute;right:clamp(28px,9%,96px);bottom:100%;width:76px;height:42px;overflow:hidden;pointer-events:none}',
    '.qk-ft-peek img{display:block;transform:translateY(100%);transition:transform .8s cubic-bezier(.3,1.5,.5,1) .15s}',
    '.qk-ft.in .qk-ft-peek img{transform:translateY(18%)}',
    '.qk-ft.in:hover .qk-ft-peek img{transform:translateY(6%)}',
    '.qk-ft-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.8fr);gap:28px}',
    '.qk-ft-brand{display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-width:0}',
    '.qk-ft-brand b{display:flex;align-items:center;gap:8px;font-size:17px}',
    '.qk-ft-brand b img{border-radius:50%;background:var(--_surface)}',
    '.qk-ft-brand p{margin:0;font-size:13.5px;color:var(--_muted);word-break:keep-all}',
    '.qk-ft-brand .mail{font-size:14px;color:var(--_ink);font-weight:600;text-decoration:none;max-width:100%;overflow-wrap:anywhere}',
    '.qk-ft-brand .mail:hover{text-decoration:underline;text-underline-offset:3px}',
    '.qk-ft-sns{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}',
    '.qk-ft-sns a{display:inline-flex;align-items:center;gap:4px;padding:3px 12px 3px 5px;border-radius:999px;background:var(--_surface);font-size:13px;font-weight:600;color:var(--_ink);text-decoration:none;border:1px solid var(--_line)}',
    '.qk-ft-sns a:hover{border-color:var(--_muted)}',
    '.qk-ft-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:18px}',
    '.qk-ft-col h4{margin:0 0 10px;font-size:13px;color:var(--_muted);font-weight:700}',
    '.qk-ft-col ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px}',
    '.qk-ft-col a{font-size:14px;color:var(--_ink);text-decoration:none}.qk-ft-col a:hover{text-decoration:underline;text-underline-offset:3px}',
    '.qk-ft-bot{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;border-top:1px solid var(--_line);padding-top:16px;font-size:12.5px;color:var(--_muted)}',
    '.qk-ft-bot .cp{margin-right:auto}',
    '.qk-ft-bot a{color:var(--_muted);text-decoration:none}.qk-ft-bot a:hover{text-decoration:underline}.qk-ft-bot a.pv{color:var(--_ink);font-weight:800}',
    '@container qkft (max-width:620px){.qk-ft-top{grid-template-columns:minmax(0,1fr)}.qk-ft-cols{grid-template-columns:repeat(2,minmax(0,1fr))}.qk-ft-bot .cp{width:100%}}',
    // totop
    '.qk-top{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(var(--qk-totop-bottom,20px) + env(safe-area-inset-bottom));z-index:55;width:54px;height:54px;border-radius:50%;border:0;padding:0;background:var(--_surface);color:var(--_accent);box-shadow:0 8px 24px rgba(30,20,40,.16);cursor:pointer;display:grid;place-items:center;opacity:0;visibility:hidden;transform:translateY(14px) scale(.9);transition:opacity .25s,transform .25s cubic-bezier(.3,1.4,.5,1),visibility 0s .25s,bottom .25s}',
    '.qk .qk-top{color:var(--_accent)}',
    '.qk-top.left{right:auto;left:max(16px,env(safe-area-inset-left))}',
    '.qk-top.show{opacity:1;visibility:visible;transform:none;transition:opacity .25s,transform .25s cubic-bezier(.3,1.4,.5,1),visibility 0s,bottom .25s}',
    '.qk-top .ring{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}',
    '.qk-top .ring circle{fill:none;stroke:var(--_line);stroke-width:2.5}',
    '.qk-top .ring .p{stroke:var(--_accent);stroke-dasharray:100;stroke-dashoffset:100;stroke-linecap:round}',
    '.qk-top .up{position:absolute;top:5px;left:50%;margin-left:-7px}',
    '.qk-top img{margin-top:10px;transition:transform .2s}',
    '.qk-top:hover img{transform:translateY(-3px)}',
    '.qk-top.hop img{animation:qktophop .5s cubic-bezier(.3,1.5,.5,1)}',
    '@keyframes qktophop{40%{transform:translateY(-9px)}}',
    'body:has(quoka-guide[floating][minimized]) .qk-top:not(.left){bottom:calc(96px + env(safe-area-inset-bottom))}',
    'body:has(quoka-guide[floating]:not([minimized])) .qk-top:not(.left){opacity:0;visibility:hidden}',
    // theme
    'quoka-theme{display:inline-block}',
    '.qk .qk-theme{display:inline-flex;align-items:center;gap:8px;border:0;background:none;padding:2px;cursor:pointer;font:inherit;font-size:13px;font-weight:700;color:var(--_muted)}',
    '.qk-theme .trk{position:relative;display:block;width:60px;height:32px;border-radius:999px;background:var(--_soft);box-shadow:inset 0 0 0 1px var(--_line);transition:background .3s}',
    '.qk-theme .trk > i{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:0;transition:opacity .3s}',
    '.qk-theme .trk > i:nth-child(1){left:12px;top:9px}.qk-theme .trk > i:nth-child(2){left:20px;top:18px;width:2px;height:2px}.qk-theme .trk > i:nth-child(3){left:9px;top:21px;width:2px;height:2px}',
    '.qk-theme .knob{position:absolute;left:3px;top:3px;width:26px;height:26px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 2px 6px rgba(20,10,30,.18);transition:transform .35s cubic-bezier(.3,1.4,.5,1)}',
    '.qk-theme .knob img{display:block}',
    '.qk-theme.dark .trk{background:#262B3D;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}',
    '.qk-theme.dark .trk > i{opacity:.85}',
    '.qk-theme.dark .knob{transform:translateX(28px);background:#E9E6F2}',
    '.qk-theme:focus-visible{outline:none}.qk-theme:focus-visible .trk{outline:2px solid var(--_accent);outline-offset:2px}',
    // pager
    'quoka-pager{display:block;container:qkpg / inline-size}',
    '.qk-pager{display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:nowrap;padding-top:6px}',
    '.qk .qk-pg{position:relative;display:inline-grid;place-items:center;min-width:40px;height:40px;padding:0 6px;border-radius:13px;border:0;background:transparent;font:inherit;font-size:14.5px;font-weight:600;color:var(--_muted);text-decoration:none;cursor:pointer;font-variant-numeric:tabular-nums}',
    '.qk .qk-pg:hover:not([disabled]):not([aria-current]){background:var(--_soft);color:var(--_ink)}',
    '.qk .qk-pg[disabled]{opacity:.3;cursor:default}',
    '.qk .qk-pg[aria-current]{background:var(--_ink);color:var(--_surface);font-weight:800;z-index:0;cursor:default}',
    '.qk-pg[aria-current]::before,.qk-pg[aria-current]::after{content:"";position:absolute;top:-4px;width:12px;height:12px;border-radius:50%;background:var(--_accent-soft);box-shadow:inset 0 0 0 3px var(--_ink);z-index:-1}',
    '.qk-pg[aria-current]::before{left:2px}.qk-pg[aria-current]::after{right:2px}',
    '.qk-pg.arr{color:var(--_ink)}',
    '.qk-pg-gap{min-width:24px;text-align:center;color:var(--_muted)}',
    '.qk-pg-mini{display:none;font-size:14.5px;color:var(--_muted);font-variant-numeric:tabular-nums;padding:0 10px}.qk-pg-mini b{color:var(--_ink)}',
    '@container qkpg (max-width:420px){.qk-pager .qk-pg:not(.arr),.qk-pg-gap{display:none}.qk-pg-mini{display:inline}}',
    // skeleton
    'quoka-skeleton{display:block}',
    '.qk-sk{display:flex;flex-direction:column;gap:10px}',
    '.qk-sk i{display:block;background:color-mix(in srgb,var(--_ink) 8%,transparent);animation:qksk 1.4s ease-in-out infinite;animation-delay:calc(var(--i) * 120ms)}',
    '@keyframes qksk{50%{opacity:.45}}',
    '.qk-sk .l{height:12px;border-radius:6px}.qk-sk .l.s{height:10px}',
    '.qk-sk .row{display:flex;gap:12px;align-items:center}',
    '.qk-sk.post .row,.qk-sk.file .row{padding:14px;border:1px solid var(--_line);border-radius:18px;background:var(--_surface)}',
    '.qk-sk .row > span{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0}',
    '.qk-sk .c{width:40px;height:40px;border-radius:50%;flex:none}',
    '.qk-sk .sq{width:42px;height:42px;border-radius:12px;flex:none}',
    '.qk-sk .pill{width:46px;height:30px;border-radius:12px;flex:none}',
    '.qk-sk.card{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}',
    '.qk-sk.card .row{flex-direction:column;align-items:stretch;gap:9px;padding:0 0 4px}',
    '.qk-sk .img{aspect-ratio:4 / 3;border-radius:16px;margin-bottom:4px}',
    '.qk-sk.text .row{flex-direction:column;align-items:stretch;gap:9px}',
    '.qk-sk.text{gap:22px}',
    // share
    'quoka-share{display:inline-block}',
    '.qk .qk-share{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--_line);background:var(--_surface);color:var(--_ink);border-radius:999px;padding:4px 14px 4px 7px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer}',
    '.qk .qk-share:hover{border-color:var(--_muted)}',
    '.qk .qk-share.round{width:44px;height:44px;padding:0;justify-content:center}',
    '@media (prefers-reduced-motion:reduce){.qk-hero-orb,.qk-sk i,.qk-top.hop img,.qk-lb[open]{animation:none!important}.qk-tl.anim .qk-tl-item{opacity:1;transform:none}.qk-ft-peek img,.qk-theme .knob,.qk-top,.qk-banner{transition:none!important}}',
    // village
    'quoka-village{display:block}',
    '.qk-vil{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.qk-vil-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}',
    '.qk-vil-top > div{display:flex;flex-direction:column}.qk-vil-top b{font-size:20px}.qk-vil-top small{font-size:13px;color:var(--_muted)}',
    '.qk .qk-vil-me{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--_line);background:var(--_surface);border-radius:999px;padding:3px 12px 3px 4px;font-size:14px;font-weight:700;cursor:pointer;color:var(--_ink)}',
    '.qk-vil-me img{border-radius:50%;background:var(--_soft)}.qk-vil-me i{font-style:normal;font-size:12px;color:var(--_muted);font-weight:600}',
    '.qk-vil-hint{margin:0;font-size:13px;color:var(--_muted);text-align:center}.qk-vil-hint .sw-only{display:none}',
    // 납작 지도(그림 폴더가 없을 때)
    '.qk-vil-map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}',
    '.qk .qk-vil-map .qk-vil-house{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 10px 14px;border:1px solid var(--_line);border-radius:22px;background:var(--_surface);cursor:pointer;color:var(--_ink);text-align:center;transition:transform .2s,box-shadow .2s;min-width:0}',
    '.qk-vil-map .qk-vil-house:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(30,20,40,.07)}',
    '.qk-vil-map .qk-vil-house svg{width:min(120px,80%);height:auto}',
    '.qk-vil-map .qv-tg{display:flex;flex-direction:column;align-items:center;gap:4px}',
    '.qk-vil-map .ic{position:absolute;top:12px;left:12px}',
    '.qk-vil-map b{font-size:15px;word-break:keep-all}',
    '.qk-vil-map .lv{font-size:11px;font-weight:800;color:var(--_muted);background:var(--_soft);border-radius:999px;padding:1px 8px}',
    '.qk-vil-map .cnt{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--_accent);font-weight:800}',
    '.qk-vil-map .cnt em{font-style:normal}',
    '.qk-vil-house .faces{display:flex}.qk-vil-house .faces img{margin-left:-6px;border-radius:50%;background:var(--_surface);box-shadow:0 0 0 2px var(--_surface)}',
    '.qk-vil-map .mine{position:absolute;top:12px;right:12px;font-size:11px;font-weight:800;color:var(--_accent);background:var(--_accent-soft);border-radius:999px;padding:1px 8px}',
    '.qk-vil-map .qk-vil-house.plaza{grid-column:1 / -1}',
    '@media (min-width:761px){.qk-vil-map .qk-vil-house.plaza{flex-direction:row;justify-content:center;gap:18px;padding:12px 18px 12px 48px}.qk-vil-map .qk-vil-house.plaza svg{width:96px}.qk-vil-map .plaza .qv-tg{flex-direction:row;gap:10px}}',
    // 그림 지도
    '.qk-vil-world{position:relative;aspect-ratio:1920/1086;border-radius:24px;overflow:hidden;background:#B9D99A center/cover no-repeat;box-shadow:0 0 0 1px var(--_line),0 18px 44px rgba(40,30,60,.08)}',
    '.qk .qk-vil-world .qk-vil-house{position:absolute;width:19%;aspect-ratio:1.15;transform:translate(-50%,-56%);border:0;background:none;padding:0;cursor:pointer;border-radius:30px;color:#2A2433}',
    '.qk .qk-vil-world .qk-vil-house.plaza{width:22%;aspect-ratio:1.5;transform:translate(-50%,-50%)}',
    '.qk-vil-world .qk-vil-house:focus-visible{outline:3px solid #fff;outline-offset:-4px;box-shadow:0 0 0 6px rgba(42,36,51,.35)}',
    '.qk-vil-wscroll{overflow-x:auto;overflow-y:hidden;border-radius:24px;scrollbar-width:none;-webkit-overflow-scrolling:touch}.qk-vil-wscroll::-webkit-scrollbar{display:none}',
    '.qk-vil-world .glow{position:absolute;left:-12%;right:-12%;top:-14%;bottom:-8%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,0) 62%,rgba(255,255,255,.9) 80%,rgba(255,255,255,0) 100%);filter:blur(5px);opacity:0;transition:opacity .5s;pointer-events:none}',
    '.qk-vil-world [data-lv="2"] .glow{opacity:.3}.qk-vil-world [data-lv="3"] .glow{opacity:.5}.qk-vil-world [data-lv="4"] .glow{opacity:.7}.qk-vil-world [data-lv="5"] .glow{opacity:.9}',
    '.qk-vil-world .spk{position:absolute;inset:0;pointer-events:none}',
    '.qk-vil-world .spk i{position:absolute;width:8%;aspect-ratio:1;filter:drop-shadow(0 0 3px rgba(150,129,220,.95));animation:qkvtw 2.6s ease-in-out infinite}',
    '.qk-vil-world .spk i::before{content:"";position:absolute;inset:0;background:#fff;clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)}',
    '.qk-vil-world .spk i:nth-child(1){left:10%;top:10%}.qk-vil-world .spk i:nth-child(2){right:8%;top:4%;animation-delay:.7s}.qk-vil-world .spk i:nth-child(3){left:2%;top:46%;width:6%;animation-delay:1.3s}.qk-vil-world .spk i:nth-child(4){right:0;top:42%;width:6%;animation-delay:1.9s}',
    '@keyframes qkvtw{0%,100%{opacity:.2;transform:scale(.55)}50%{opacity:1;transform:scale(1)}}',
    '.qk-vil-world .qv-tg{position:absolute;left:50%;top:100%;transform:translate(-50%,-34%);display:inline-flex;align-items:center;gap:6px;white-space:nowrap;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-radius:999px;padding:4px 11px 4px 5px;box-shadow:0 6px 18px rgba(40,30,60,.14);transition:transform .2s}',
    '.qk-vil-world .qk-vil-house:hover .qv-tg{transform:translate(-50%,-44%)}',
    '.qk-vil-world .plaza .qv-tg{top:auto;bottom:-6%;transform:translate(-50%,0)}.qk-vil-world .plaza:hover .qv-tg{transform:translate(-50%,-6%)}',
    '.qk-vil-world .qv-tg b{font-size:14px;font-weight:800}',
    '.qk-vil-world .lv{font-size:10.5px;font-weight:800;color:#6B6478;background:#F1EEF6;border-radius:999px;padding:1px 7px}',
    '.qk-vil-world [data-lv="3"] .lv,.qk-vil-world [data-lv="4"] .lv,.qk-vil-world [data-lv="5"] .lv{background:#E3DBFB;color:#6A55C2}',
    '.qk-vil-world .cnt{display:none;align-items:center;gap:4px;font-size:12px;font-weight:800;color:#C2557E}',
    '.qk-vil-world .on .cnt{display:inline-flex}.qk-vil-world .cnt em{font-style:normal}',
    '.qk-vil-world .on .qv-tg{box-shadow:0 0 0 2px #F2A3BE,0 6px 18px rgba(40,30,60,.14)}',
    '.qk-vil-world .mine{position:absolute;left:50%;top:2%;transform:translate(-50%,-50%);font-size:11px;font-weight:800;color:#fff;background:#2A2433;border-radius:999px;padding:2px 9px;white-space:nowrap}',
    // 방
    '.qk-vil-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.qk .qk-vil-bar .back{display:inline-flex;align-items:center;gap:2px;border:0;background:var(--_soft);border-radius:999px;padding:6px 12px 6px 6px;font-size:13.5px;font-weight:700;cursor:pointer;color:var(--_ink)}',
    '.qk-vil-bar .ttl{display:inline-flex;align-items:center;gap:6px;font-size:17px}',
    '.qk-vil-bar .ntc{font-size:13px;color:var(--_muted);background:var(--_soft);border-radius:999px;padding:2px 10px}.qk-vil-bar .ntc:empty{display:none}',
    '.qk-vil-bar .sp{flex:1}.qk-vil-bar .pc{font-size:13px;font-weight:700;color:var(--_muted)}',
    '.qk-vil-room{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:12px;align-items:start}',
    '.qk-vil-stage{position:relative;overflow:hidden;border-radius:20px;outline:none;min-width:0;box-shadow:0 0 0 1px var(--_line)}',
    '.qk-vil.art .qk-vil-stage{background:#F4F1F8}',
    '.qk-vil-stage:focus-visible{box-shadow:0 0 0 2px var(--_accent)}',
    '.qk-vil-scene{position:absolute;left:0;top:0;transform-origin:0 0;touch-action:manipulation;user-select:none;-webkit-user-select:none;cursor:pointer;transition:transform .3s ease}',
    '.qk-vil-scene .bg{position:absolute;inset:0}',
    '.qk-vil.art .qk-vil-scene .bg{background-size:100% 100%;background-repeat:no-repeat}',
    '.qk-vil-scene .items,.qk-vil-scene .avs,.qk-vil-scene .tags{position:absolute;inset:0;pointer-events:none}',
    '.qk-vil-item{position:absolute;line-height:0}',
    '.qk-vil-item svg,.qk-vil-scene .ghost svg{display:block;overflow:visible}',
    '.qk-vil-item img,.qk-vil-scene .ghost img{display:block;width:100%;height:100%;object-fit:contain;-webkit-user-drag:none}',
    '.qk-vil-item .rug,.qk-vil-scene .ghost .rug{display:block;width:100%;height:100%;box-sizing:border-box;border:3px solid;border-radius:16%/26%}',
    '.qk-vil.art .qk-vil-item .rug,.qk-vil.art .qk-vil-scene .ghost .rug{border-width:6px;opacity:.9;box-shadow:inset 0 0 0 14px rgba(255,255,255,.4)}',
    '.qk-vil-scene.editing{cursor:crosshair}',
    '.qk-vil-item.sel{outline:2px dashed var(--_accent);outline-offset:2px;border-radius:8px}',
    '.qk-vil.art .qk-vil-item.sel{outline-width:5px;outline-offset:6px;border-radius:18px}',
    '.qk-vil-scene .ghost{position:absolute;z-index:800;opacity:.6;pointer-events:none;line-height:0}.qk-vil-scene .ghost.bad{opacity:.35;filter:grayscale(1)}',
    // 하는 일 이름표
    '.qk .qk-vil-tag{position:absolute;z-index:900;transform:translate(-50%,-100%);pointer-events:auto;display:inline-flex;align-items:center;gap:calc(5px*var(--k,1));white-space:nowrap;border:0;border-radius:999px;background:rgba(255,255,255,.94);color:#2A2433;font-size:calc(12px*var(--k,1));font-weight:800;padding:calc(3px*var(--k,1)) calc(10px*var(--k,1)) calc(3px*var(--k,1)) calc(7px*var(--k,1));box-shadow:0 calc(3px*var(--k,1)) calc(10px*var(--k,1)) rgba(40,30,60,.16);cursor:pointer;transition:transform .15s}',
    '.qk-vil-tag::before{content:"";width:calc(8px*var(--k,1));height:calc(8px*var(--k,1));border-radius:50%;background:#E68AAB}',
    '.qk-vil-tag.qv-t-meet::before{background:#52B49A}.qk-vil-tag.qv-t-links::before{background:#9681DC}',
    '.qk-vil-tag:hover{transform:translate(-50%,-100%) translateY(calc(-2px*var(--k,1)))}',
    '.qk .qk-vil-tag.live{background:#2A2433;color:#fff}.qk-vil-tag.live::before{background:#82D4BE;animation:qkvblink 1.2s ease-in-out infinite}',
    '@keyframes qkvblink{50%{opacity:.25}}',
    // 사람
    '.qk-vil-av{position:absolute;left:0;top:0;width:44px;height:68px;display:flex;flex-direction:column;align-items:center;transition:transform .17s linear;pointer-events:none}',
    '.qk-vil-av img{position:relative;z-index:1;display:block;margin-top:14px;filter:drop-shadow(0 2px 2px rgba(40,20,30,.15))}',
    '.qk-vil-av .sh{width:30px;height:8px;border-radius:50%;background:rgba(40,25,40,.16);margin-top:-6px}',
    '.qk-vil-av .nm{margin-top:2px;font-size:10.5px;font-weight:700;color:var(--_ink);background:rgba(255,255,255,.88);border-radius:999px;padding:0 6px;white-space:nowrap;max-width:96px;overflow:hidden;text-overflow:ellipsis}',
    '.qk-vil-av.me .nm{background:var(--_ink);color:var(--_surface)}',
    '.qk-vil-av.walk img{animation:qkvwalk .34s ease-in-out infinite}',
    '@keyframes qkvwalk{50%{transform:translateY(-3px)}}',
    '.qk-vil-av.sit .sh{opacity:0}',
    '.qk-vil-av .bub{position:absolute;bottom:62px;left:50%;transform:translateX(-50%);background:#fff;color:#2A2433;border:1px solid rgba(42,36,51,.12);border-radius:12px;padding:4px 9px;font-size:12px;line-height:1.35;width:max-content;max-width:170px;white-space:normal;word-break:keep-all;box-shadow:0 4px 12px rgba(30,20,40,.1);z-index:4}',
    '.qk-vil-av .bub::after{content:"";position:absolute;left:50%;bottom:-5px;width:8px;height:8px;background:inherit;border-right:1px solid rgba(42,36,51,.12);border-bottom:1px solid rgba(42,36,51,.12);transform:translateX(-50%) rotate(45deg)}',
    '.qk-vil-av .hd{position:absolute;top:0;right:-4px;z-index:3;font-size:15px;animation:qkvhand 1s ease-in-out infinite}',
    '@keyframes qkvhand{50%{transform:rotate(-14deg)}}',
    // 그림 쿼카(몸 그림 + 2D 얼굴, 이름은 머리 위)
    '.qk-vil.art .qk-vil-av{display:block}',
    '.qk-vil.art .qk-vil-av .body{position:absolute;inset:0}',
    '.qk-vil.art .qk-vil-av .bd{position:absolute;left:0;top:0;width:100%;height:100%;margin:0;filter:drop-shadow(0 6px 5px rgba(40,25,50,.1))}',
    '.qk-vil.art .qk-vil-av .hh{position:absolute;left:-12.2%;top:0;margin:-27.06% 0 0;width:124.7%;height:auto;aspect-ratio:1;filter:none}',
    '.qk-vil.art .qk-vil-av.walk .bd,.qk-vil.art .qk-vil-av.walk .hh{animation:qkvwalk2 .34s ease-in-out infinite}',
    '@keyframes qkvwalk2{50%{transform:translateY(-6px)}}',
    '.qk-vil.art .qk-vil-av .sh{position:absolute;left:16%;bottom:-3%;width:68%;height:8%;margin:0;background:rgba(40,25,50,.13)}',
    '.qk-vil.art .qk-vil-av .nm{position:absolute;left:50%;bottom:100%;transform:translateX(-50%);margin:0 0 30%;z-index:3;font-size:calc(11px*var(--k,1));padding:0 calc(7px*var(--k,1));max-width:none;line-height:1.55;color:#2A2433;background:rgba(255,255,255,.92);box-shadow:0 calc(2px*var(--k,1)) calc(6px*var(--k,1)) rgba(40,30,60,.12)}',
    '.qk-vil.art .qk-vil-av.me .nm{background:#2A2433;color:#fff}',
    '.qk-vil.art .qk-vil-av .bub{bottom:100%;margin-bottom:calc(30% + 24px*var(--k,1));font-size:calc(12.5px*var(--k,1));padding:calc(4px*var(--k,1)) calc(10px*var(--k,1));border-radius:calc(12px*var(--k,1));max-width:calc(180px*var(--k,1))}',
    '.qk-vil.art .qk-vil-av .bub::after{width:calc(8px*var(--k,1));height:calc(8px*var(--k,1));bottom:calc(-5px*var(--k,1))}',
    '.qk-vil.art .qk-vil-av .hd{top:-22%;right:-16%;font-size:calc(17px*var(--k,1))}',
    // 옆 칸
    '.qk-vil-side{display:flex;flex-direction:column;gap:6px;border:1px solid var(--_line);border-radius:18px;background:var(--_surface);padding:12px;min-width:0;max-height:100%}',
    '.qk-vil-side .acts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:8px}',
    '.qk .qk-vil-side .acts button{display:flex;flex-direction:column;align-items:flex-start;gap:1px;border:0;border-radius:14px;padding:9px 9px 8px;cursor:pointer;text-align:left;background:#FBE3EC;color:#2A2433;min-width:0;transition:transform .15s}',
    '.qk-vil-side .acts button:hover{transform:translateY(-1px)}',
    '.qk .qk-vil-side .acts button:nth-child(2){background:#DDF3EA}.qk .qk-vil-side .acts button:nth-child(3){background:#ECE6FB}',
    '.qk-vil-side .acts b{font-size:13px;white-space:nowrap}.qk-vil-side .acts span{font-size:11.5px;color:#6B6478;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}',
    '.qk .qk-vil-side .acts .live{box-shadow:inset 0 0 0 2px #2A2433}',
    '.qk-vil-side .h{margin:0;font-size:12px;font-weight:700;color:var(--_muted)}',
    '.qk-vil-side .ppl{list-style:none;margin:0 0 6px;padding:0;display:flex;flex-direction:column;gap:4px}',
    '.qk-vil-side .ppl li{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600}.qk-vil-side .ppl img{border-radius:50%;background:var(--_soft)}.qk-vil-side .ppl i{font-style:normal;margin-left:auto}',
    '.qk-vil-side .log{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;max-height:200px;overflow:auto;font-size:12.5px;line-height:1.45}',
    '.qk-vil-side .log:empty::before{content:"아직 조용해요";color:var(--_muted)}',
    '.qk-vil-side .log b{margin-right:4px}.qk-vil-side .log span{word-break:keep-all}',
    '.qk-vil-dock{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
    '.qk-vil-dock[hidden],.qk-vil-deco[hidden]{display:none}',
    '.qk-vil-dock .chat{display:flex;gap:6px;flex:1 1 260px;min-width:0}',
    '.qk-vil-dock input{flex:1;min-width:0;font:inherit;font-size:14.5px;border:1.5px solid var(--_line);border-radius:999px;padding:8px 14px;background:var(--_surface);color:var(--_ink)}',
    '.qk-vil-dock input:focus{outline:none;border-color:var(--_accent)}',
    '.qk-vil-dock .emo{display:flex;gap:2px}',
    '.qk .qk-vil-dock .emo button{border:0;background:none;padding:2px;border-radius:50%;cursor:pointer;line-height:0;transition:transform .15s}',
    '.qk-vil-dock .emo button:hover{transform:translateY(-2px) scale(1.08);background:var(--_soft)}',
    '.qk-vil-dock .hand[aria-pressed="true"],.qk-vil-bar .deco.go{background:var(--_ink);border-color:var(--_ink);color:var(--_surface)}',
    // 꾸미기
    '.qk-vil-deco{display:flex;flex-direction:column;gap:10px;border:1px solid var(--_line);border-radius:18px;background:var(--_surface);padding:12px}',
    '.qk-vil-deco .qv-tabs{display:flex;gap:4px;flex-wrap:wrap}',
    '.qk .qk-vil-tab{border:0;background:var(--_soft);border-radius:999px;padding:5px 12px;font-size:13px;font-weight:700;cursor:pointer;color:var(--_muted)}',
    '.qk .qk-vil-tab[aria-pressed="true"]{background:var(--_ink);color:var(--_surface)}',
    '.qk-vil-deco .body{display:flex;flex-direction:column;gap:10px}',
    '.qk-vil-deco .pal{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:6px}',
    '.qk .qk-vil-pick{display:flex;flex-direction:column;align-items:center;gap:4px;border:1.5px solid var(--_line);background:var(--_surface);border-radius:14px;padding:8px 4px 6px;font-size:12px;font-weight:600;cursor:pointer;color:var(--_ink)}',
    '.qk-vil-pick[aria-pressed="true"]{border-color:var(--_accent);background:var(--_accent-soft)}',
    '.qk-vil-pick .th{display:grid;place-items:center;width:64px;height:52px}.qk-vil-pick .th svg,.qk-vil-pick .th img{max-width:64px;max-height:52px;width:auto;height:auto}',
    '.qk-vil-pick .th .rug{width:56px;height:34px;box-sizing:border-box;border:3px solid;border-radius:16%/26%}',
    '.qk-vil-deco .sw{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:var(--_muted)}.qk-vil-deco .sw span{min-width:64px}',
    '.qk .qk-vil-sw{width:26px;height:26px;border-radius:50%;border:2px solid var(--_surface);box-shadow:0 0 0 1px var(--_line);cursor:pointer;padding:0}',
    '.qk-vil-sw[aria-pressed="true"]{box-shadow:0 0 0 2px var(--_ink)}',
    '.qk-vil-deco .ntc{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:var(--_muted)}',
    '.qk-vil-deco .ntc input{flex:1;min-width:0;font:inherit;font-size:14px;border:1.5px solid var(--_line);border-radius:10px;padding:7px 10px;background:var(--_surface);color:var(--_ink)}',
    '.qk-vil-deco .hint{margin:0;display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:var(--_muted)}',
    // 하는 일 창(포스트잇 · 모임 · 자료)
    '.qv-act{display:flex;flex-direction:column;gap:14px}',
    '.qv-form{display:flex;flex-direction:column;gap:8px}',
    '.qv-form textarea,.qv-form input{font:inherit;font-size:15px;border:1.5px solid var(--_line);border-radius:14px;padding:10px 12px;background:var(--_surface);color:var(--_ink);resize:vertical;min-width:0}',
    '.qv-form textarea:focus,.qv-form input:focus{outline:none;border-color:var(--_accent)}',
    '.qv-form .row{display:flex;align-items:center;justify-content:space-between;gap:10px}',
    '.qv-form .row small{font-size:12px;color:var(--_muted);line-height:1.4}',
    '.qv-form .cs{display:flex;gap:6px}',
    '.qv-form .qk-cta{align-self:auto;flex:none}',
    '.qv-form.inline{flex-direction:row}.qv-form.inline input{flex:1}',
    '.qv-l-notes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:4px}',
    '.qv-note{position:relative;border-radius:4px 4px 16px 4px;padding:12px 26px 10px 12px;min-height:96px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;color:#2A2433;transform:rotate(var(--r,0deg));box-shadow:0 8px 16px rgba(40,30,60,.08)}',
    '.qv-note p{margin:0;font-size:14px;line-height:1.5;word-break:keep-all;white-space:pre-wrap}',
    '.qv-note small{display:flex;align-items:center;gap:4px;font-size:11.5px;color:rgba(42,36,51,.62)}.qv-note small img{border-radius:50%;background:rgba(255,255,255,.6)}',
    '.qk .qv-note .x,.qk .qv-link .x{position:absolute;top:4px;right:6px;border:0;background:none;font-size:18px;line-height:1;cursor:pointer;color:inherit;opacity:.45;padding:2px 4px}',
    '.qv-note .x:hover,.qv-link .x:hover{opacity:1}',
    '.qv-list .empty{grid-column:1/-1;margin:0;padding:20px;text-align:center;font-size:13.5px;color:var(--_muted);background:var(--_soft);border-radius:14px}',
    '.qv-l-links{display:flex;flex-direction:column;gap:6px}',
    '.qv-link{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:10px;align-items:center;padding:10px 32px 10px 10px;border:1px solid var(--_line);border-radius:14px}',
    '.qv-link .sp{grid-row:span 2;width:6px;height:32px;border-radius:3px;background:#BBA8EF}',
    '.qv-link a{font-weight:700;font-size:14.5px;color:var(--_ink);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.qv-link a:hover{text-decoration:underline}',
    '.qv-link small{font-size:12px;color:var(--_muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.qv-topic{background:var(--_soft);border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:2px}',
    '.qv-topic small{font-size:12px;color:var(--_muted);font-weight:700}.qv-topic b{font-size:17px;word-break:keep-all}',
    '.qv-timer{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.qv-timer span{font-size:13px;font-weight:700;color:var(--_muted);margin-right:4px}.qv-timer b{font-size:26px;font-variant-numeric:tabular-nums;margin-right:6px}',
    '.qv-stamp{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.qv-stamp small{font-size:12.5px;color:var(--_muted)}',
    '.qv-stamp .qk-cta{align-self:auto}.qv-stamp .qk-cta[disabled]{opacity:.45;cursor:default}',
    '.qv-l-stamps{display:flex;flex-wrap:wrap;gap:10px}',
    '.qv-stamp-i{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;font-weight:700;width:64px;text-align:center;word-break:keep-all}.qv-stamp-i img{border-radius:50%;background:var(--_accent-soft);box-shadow:0 0 0 2px var(--_surface),0 0 0 4px #F2A3BE}',
    // 나 정하기
    '.qk-vil-setup{display:grid;grid-template-columns:auto minmax(0,1fr);gap:20px;align-items:start;border:1px solid var(--_line);border-radius:22px;background:var(--_surface);padding:22px}',
    '.qk-vil-setup .pv{width:120px;height:120px;border-radius:50%;background:var(--_accent-soft);display:grid;place-items:center}',
    '.qk-vil-setup .fs{display:flex;flex-direction:column;gap:12px;min-width:0}.qk-vil-setup h3{margin:0;font-size:19px}.qk-vil-setup p{margin:0;font-size:13.5px;color:var(--_muted)}',
    '.qk-vil-setup select{font:inherit;font-size:15px;border:1.5px solid transparent;border-radius:14px;padding:11px 12px;background:var(--_soft);color:var(--_ink)}',
    '.qk-vil-setup .qk-ct-go{align-self:flex-start}',
    '@media (max-width:760px){.qk-vil-room{grid-template-columns:1fr}.qk-vil-map{grid-template-columns:repeat(2,minmax(0,1fr))}.qk-vil-setup{grid-template-columns:1fr;justify-items:center}.qk-vil-setup .fs{width:100%}.qk-vil-side .log{max-height:140px}' +
      '.qk-vil-wscroll{border-radius:18px}.qk-vil-world{min-width:560px;border-radius:0}.qk-vil-hint .sw-only{display:inline}.qk-vil-world .qv-tg{gap:4px;padding:3px 9px 3px 4px}.qk-vil-world .faces{display:none}.qk-vil-world .qv-tg b{font-size:12.5px}.qk-vil-world .lv{font-size:10px;padding:0 6px}.qk-vil-world .cnt{font-size:11px}' +
      '.qk-vil-world .is-mine .qv-tg{box-shadow:0 0 0 2px #2A2433,0 4px 12px rgba(40,30,60,.14)}.qv-l-notes{grid-template-columns:1fr 1fr;gap:8px}}',
    '@media (prefers-reduced-motion:reduce){.qk-vil-av{transition:none}.qk-vil-av.walk img,.qk-vil-av .hd,.qk-vil-world .spk i,.qk-vil-tag.live::before{animation:none!important}.qk-vil-world .spk i{opacity:.8}}',
    // 운영실 · 조직도 · 지역연구회
    'quoka-ops,quoka-org,quoka-regions{display:block}',
    '.qk .tone-pink{--t:#FDE7EF;--ti:#C2557E;--tb:#F2A3BE}.qk .tone-mint{--t:#E1F5EE;--ti:#2F8F75;--tb:#82D4BE}.qk .tone-lavender{--t:#EEE9FC;--ti:#6A55C2;--tb:#BBA8EF}.qk .tone-gray{--t:#EEF0F4;--ti:#5C6270;--tb:#C6CCD6}',
    '.qo-face{border-radius:50%;background:var(--_soft);flex:none}',
    '.qk .qk-gbtn.go{background:var(--_ink);border-color:var(--_ink);color:var(--_surface)}',
    '.qk-ops{display:flex;flex-direction:column;gap:14px;min-width:0}',
    '.qo-top{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}',
    '.qo-top h3{margin:0;font-size:22px;letter-spacing:-.01em}.qo-top p{margin:2px 0 0;font-size:13.5px;color:var(--_muted)}',
    '.qk .qo-me{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--_line);background:var(--_surface);border-radius:999px;padding:4px 14px 4px 5px;cursor:pointer;color:var(--_ink);text-align:left}',
    '.qo-me > span{display:flex;flex-direction:column;line-height:1.2}.qo-me b{font-size:14px}.qo-me small{font-size:11.5px;color:var(--_muted)}.qo-me i{font-style:normal;font-size:12px;color:var(--_muted);margin-left:4px}',
    '.qo-sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}',
    '.qk .qo-chip{display:flex;flex-direction:column;align-items:flex-start;gap:2px;border:1px solid var(--_line);background:var(--_surface);border-radius:18px;padding:12px 16px;cursor:pointer;color:var(--_ink);text-align:left;transition:transform .15s}',
    '.qo-chip:hover{transform:translateY(-1px)}.qo-chip b{font-size:24px;font-variant-numeric:tabular-nums;line-height:1.1}.qo-chip span{font-size:12.5px;color:var(--_muted);font-weight:600}',
    '.qo-chip.new b,.qo-chip.late b{color:#C2557E}',
    '.qo-body{display:grid;grid-template-columns:210px minmax(0,1fr);gap:16px;align-items:start}',
    '.qo-rail{display:flex;flex-direction:column;gap:2px;position:sticky;top:12px;max-height:calc(100vh - 24px);overflow:auto;padding:0 2px 6px 0;scrollbar-width:thin}',
    '.qo-rh{margin:12px 8px 4px;font-size:11.5px;font-weight:800;color:var(--_muted);letter-spacing:.02em}',
    '.qk .qo-ri{display:flex;align-items:center;gap:8px;border:0;background:none;border-radius:12px;padding:5px 8px;cursor:pointer;color:var(--_ink);text-align:left;font-size:14px;font-weight:600;min-width:0;flex:none}',
    '.qo-ri:hover{background:var(--_soft)}.qk .qo-ri.on{background:var(--_ink);color:var(--_surface)}',
    '.qo-ri .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.qo-ri em{font-style:normal;font-size:11.5px;font-weight:800;min-width:20px;height:20px;border-radius:999px;background:var(--_soft);color:var(--_muted);display:grid;place-items:center;padding:0 6px;box-sizing:border-box}',
    '.qo-ri.on em{background:rgba(255,255,255,.22);color:inherit}.qo-ri.hot em{background:#E68AAB;color:#fff}',
    '.qo-ri .pl{width:26px;height:26px;border-radius:9px;border:1.5px dashed var(--_line);display:grid;place-items:center;color:var(--_muted);font-weight:700;box-sizing:border-box}.qo-ri.add{color:var(--_muted)}',
    '.qo-main{display:flex;flex-direction:column;gap:14px;min-width:0;scroll-margin-top:12px}',
    '.qo-grid2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:14px;align-items:start}',
    '.qo-card,.qo-teams{border:1px solid var(--_line);border-radius:20px;background:var(--_surface);padding:16px}',
    '.qo-card .hd,.qo-teams .hd{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}',
    '.qo-card h4,.qo-teams h4,.qo-sec h4{margin:0;font-size:16px}.qo-card .hd small,.qo-teams .hd small{font-size:12px;color:var(--_muted)}',
    '.qo-sec p{margin:2px 0 0;font-size:13px;color:var(--_muted)}',
    '.qo-due ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
    '.qo-due li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;column-gap:10px;align-items:center;padding:8px 0;border-top:1px solid var(--_line)}.qo-due li:first-child{border-top:0}',
    '.qo-due li quoka-icon{grid-row:span 2}.qo-due .w{grid-column:2;font-size:12px;color:var(--_muted)}.qo-due .dd{grid-row:1 / span 2;grid-column:3}',
    '.qk .qo-due .t{border:0;background:none;padding:0;font-size:14px;font-weight:700;color:var(--_ink);text-align:left;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.qk-ops .dd{font-size:11.5px;font-weight:800;border-radius:999px;padding:2px 8px;background:var(--_soft);color:var(--_muted);white-space:nowrap}.qk-ops .dd.soon{background:#FDE7EF;color:#C2557E}.qk-ops .dd.late{background:#C2557E;color:#fff}',
    '.qk-ops .empty{margin:0;padding:16px;text-align:center;font-size:13px;color:var(--_muted);list-style:none}',
    '.qo-reqs .tabs{display:flex;gap:2px;background:var(--_soft);border-radius:999px;padding:3px;margin-left:auto}',
    '.qk .qo-tab{border:0;background:none;border-radius:999px;padding:4px 12px;font-size:12.5px;font-weight:700;cursor:pointer;color:var(--_muted)}',
    '.qk .qo-tab[aria-selected="true"]{background:var(--_surface);color:var(--_ink);box-shadow:0 1px 3px rgba(30,20,40,.1)}',
    '.qo-reqs .list,.qo-inq .list{display:flex;flex-direction:column;gap:8px}',
    '.qo-req{border:1px solid var(--_line);border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:5px;background:var(--_surface)}',
    '.qo-req.mine.st-new{border-color:#F2A3BE;box-shadow:0 0 0 3px #FDE7EF}.qo-req.st-done{opacity:.55}',
    '.qo-req .h{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.qo-req .kind{font-size:11.5px;font-weight:800;border-radius:999px;padding:2px 8px;background:var(--t);color:var(--ti)}',
    '.qo-req .ft{font-size:12px;font-weight:700;color:var(--_muted)}.qo-req .h .dd{margin-left:auto}',
    '.qo-req .t{font-size:14.5px}.qo-req .bd{margin:0;font-size:13px;color:var(--_muted);line-height:1.5}',
    '.qo-req .a{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:2px}.qo-req .by{font-size:12px;color:var(--_muted)}.qo-req .sp{flex:1}.qo-req .qk-gbtn{padding:5px 12px;font-size:12.5px}',
    '.qo-teams .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px}',
    '.qk .qo-tcard{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 10px;align-items:center;border:1px solid var(--_line);background:var(--_surface);border-radius:16px;padding:12px;cursor:pointer;color:var(--_ink);text-align:left;transition:transform .15s,box-shadow .15s}',
    '.qo-tcard:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(30,20,40,.06)}',
    '.qo-tcard .tx{display:flex;flex-direction:column;min-width:0}.qo-tcard b{font-size:14.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.qo-tcard small{font-size:11.5px;color:var(--_muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.qo-tcard .bar{grid-column:1/-1;display:flex;height:6px;border-radius:999px;background:var(--_soft);overflow:hidden;margin-top:6px}.qo-tcard .bar i{background:#52B49A}.qo-tcard .bar i.dg{background:#BBA8EF}',
    '.qo-tcard .ct{grid-column:1/-1;display:flex;gap:8px;font-size:11.5px;color:var(--_muted);font-weight:600}',
    '.qk .qo-tcard.tf{background:var(--t);border-color:transparent;color:#2A2433}.qo-tcard.tf small,.qo-tcard.tf .ct{color:rgba(42,36,51,.62)}.qo-tcard.tf .bar{background:rgba(255,255,255,.7)}',
    '.qo-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:start;border:1px solid var(--_line);border-radius:20px;background:var(--_surface);padding:18px}',
    '.qo-head.tf{background:var(--t);border-color:transparent;color:#2A2433}',
    '.qo-head h4{margin:0;font-size:20px;letter-spacing:-.01em}.qo-head .in{margin:2px 0 0;font-size:13.5px;color:var(--_muted)}.qo-head.tf .in{color:rgba(42,36,51,.72)}',
    '.qo-head .ppl{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}',
    '.qo-head .p{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;background:var(--_soft);border-radius:999px;padding:2px 10px 2px 3px}',
    '.qo-head.tf .p{background:rgba(255,255,255,.75)}.qo-head .p.lead{box-shadow:inset 0 0 0 1.5px var(--_ink)}',
    '.qo-head .p.want{padding:3px 10px;background:none;border:1.5px dashed var(--_line);color:var(--_muted)}',
    '.qo-head .memo{margin:10px 0 0;font-size:13px;background:var(--_soft);border-radius:10px;padding:6px 10px;display:inline-block}',
    '.qo-head .ac{display:flex;flex-direction:column;gap:6px;align-items:stretch}',
    '.qo-head.tf .qk-gbtn:not(.go){background:rgba(255,255,255,.8);border-color:transparent;color:#2A2433}',
    '.qo-period{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12px;font-weight:700}.qo-period .bar{flex:1;max-width:220px;height:6px;border-radius:999px;background:rgba(255,255,255,.8);overflow:hidden}.qo-period .bar i{display:block;height:100%;background:var(--ti)}',
    '.qo-inq .h{margin:0 0 6px;font-size:13px;font-weight:800;color:#C2557E}',
    '.qo-board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}',
    '.qo-col{background:var(--_soft);border-radius:18px;padding:10px;display:flex;flex-direction:column;gap:8px;min-width:0}',
    '.qo-col .ch{display:flex;align-items:center;gap:6px;padding:2px 4px}.qo-col .ch b{font-size:13.5px;display:inline-flex;align-items:center;gap:6px}.qo-col .ch em{font-style:normal;font-size:12px;color:var(--_muted);font-weight:700}',
    '.qo-col .ch b::before{content:"";width:8px;height:8px;border-radius:50%;background:#C6CCD6}.qo-col.c-doing .ch b::before{background:#9681DC}.qo-col.c-done .ch b::before{background:#52B49A}',
    '.qo-col .cl{display:flex;flex-direction:column;gap:6px}',
    '.qo-add{display:flex;gap:4px}.qo-add input{flex:1;min-width:0;font:inherit;font-size:13.5px;border:1.5px solid transparent;border-radius:12px;padding:8px 10px;background:var(--_surface);color:var(--_ink)}.qo-add input:focus{outline:none;border-color:var(--_accent)}',
    '.qk .qo-add button{border:0;border-radius:12px;width:36px;background:var(--_ink);color:var(--_surface);font-size:18px;cursor:pointer;flex:none}',
    '.qo-task{position:relative;background:var(--_surface);border-radius:14px;padding:10px 10px 8px 12px;box-shadow:0 1px 2px rgba(30,20,40,.06);display:flex;flex-direction:column;gap:6px}',
    '.qk .qo-task .t{border:0;background:none;padding:0 54px 0 0;font-size:14px;font-weight:700;color:var(--_ink);text-align:left;cursor:pointer;line-height:1.4;word-break:keep-all}',
    '.qo-task.done .t{color:var(--_muted);text-decoration:line-through;text-decoration-color:rgba(120,110,130,.5)}',
    '.qo-task .m{display:flex;align-items:center;gap:5px;flex-wrap:wrap;font-size:12px;color:var(--_muted)}.qo-task .w.none{opacity:.7}',
    '.qo-task .rq{font-size:10.5px;font-weight:800;color:#C2557E;background:#FDE7EF;border-radius:999px;padding:1px 6px}',
    '.qo-task .mv{position:absolute;top:7px;right:7px;display:flex;gap:3px}',
    '.qk .qo-task .mv button{width:24px;height:24px;border:0;border-radius:8px;background:var(--_soft);color:var(--_ink);cursor:pointer;font-size:14px;line-height:1;font-weight:700;padding:0}.qk .qo-task .mv button:hover{background:var(--_ink);color:var(--_surface)}',
    '.qo-col .empty{padding:14px 6px;font-size:12.5px}',
    '.qo-trail,.qo-rlist{display:flex;flex-direction:column;gap:8px}',
    '.qo-tfd{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;background:var(--t);border-radius:18px;padding:14px;color:#2A2433}',
    '.qo-tfd .tx{display:flex;flex-direction:column;gap:2px}.qo-tfd small{font-size:12px;opacity:.7}.qo-tfd p{margin:4px 0;font-size:14px}.qo-tfd .ppl{display:flex;gap:2px}',
    '.qo-rg{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:12px;align-items:center;border:1px solid var(--_line);border-radius:18px;padding:12px 14px;background:var(--_surface)}',
    '.qo-rg img{border-radius:50%;background:var(--_soft)}.qo-rg .tx{display:flex;flex-direction:column;min-width:0}.qo-rg small{font-size:12px;color:var(--_muted)}',
    '.qo-rg .st{font-size:11.5px;font-weight:800;border-radius:999px;padding:2px 9px;background:#E1F5EE;color:#2F8F75;white-space:nowrap}.qo-rg.prep{border-color:#F2A3BE}.qo-rg.prep .st{background:#FDE7EF;color:#C2557E}.qo-rg .a{display:flex;gap:6px}',
    // 창 안 입력
    '.qo-form{display:flex;flex-direction:column;gap:12px}',
    '.qo-f{display:flex;flex-direction:column;gap:5px;min-width:0}.qo-f > span{font-size:12.5px;font-weight:700;color:var(--_muted)}.qo-f > small{font-size:11.5px;color:var(--_muted);line-height:1.4}',
    '.qo-f input,.qo-f select,.qo-f textarea{font:inherit;font-size:15px;border:1.5px solid var(--_line);border-radius:12px;padding:9px 11px;background:var(--_surface);color:var(--_ink);min-width:0;width:100%;box-sizing:border-box;resize:vertical}',
    '.qo-f input:focus,.qo-f select:focus,.qo-f textarea:focus{outline:none;border-color:var(--_accent)}',
    '.qo-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.qo-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
    '.qo-btns{display:flex;align-items:center;gap:8px;margin-top:4px}.qo-btns .sp{flex:1}.qo-btns .qk-cta{align-self:auto;padding:10px 22px}',
    '.qo-lead{margin:0;font-size:13.5px;line-height:1.55;color:var(--_muted);background:var(--_soft);border-radius:12px;padding:10px 12px}',
    '.qo-note{margin:0;font-size:12px;color:var(--_muted);line-height:1.5}',
    '.qo-known{display:flex;flex-wrap:wrap;gap:4px;margin-top:2px}',
    '.qk .qo-nm{border:1px solid var(--_line);background:var(--_surface);border-radius:999px;padding:2px 8px;font-size:11.5px;cursor:pointer;color:var(--_ink)}',
    '.qo-tone{border:0;padding:0;margin:0;display:flex;align-items:center;gap:8px}.qo-tone legend{float:left;font-size:12.5px;font-weight:700;color:var(--_muted);margin-right:6px;padding:0}',
    '.qo-tone label{cursor:pointer;line-height:0;position:relative}.qo-tone input{position:absolute;opacity:0;pointer-events:none}',
    '.qo-tone .sw{display:block;width:26px;height:26px;border-radius:50%;background:var(--tb);box-shadow:0 0 0 2px var(--_surface),0 0 0 3px var(--_line)}',
    '.qo-tone input:checked + .sw{box-shadow:0 0 0 2px var(--_surface),0 0 0 4px var(--_ink)}.qo-tone input:focus-visible + .sw{outline:2px solid var(--_accent);outline-offset:4px}',
    // 조직도
    '.qk-org{display:flex;flex-direction:column;gap:22px}',
    '.qg-sec .hd{display:flex;align-items:baseline;gap:10px;margin-bottom:10px;flex-wrap:wrap}.qg-sec h4{margin:0;font-size:17px}.qg-sec .hd small{font-size:12.5px;color:var(--_muted)}',
    '.qg-sec .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}',
    '.qg-card{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:start;border:1px solid var(--_line);border-radius:18px;background:var(--_surface);padding:14px}',
    '.qg-card .tx{display:flex;flex-direction:column;gap:3px;min-width:0}.qg-card b{font-size:15px}.qg-card .r{font-size:12.5px;color:var(--_muted);line-height:1.45}',
    '.qg-card .ld{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;margin-top:4px}',
    '.qg-card .want{align-self:flex-start;margin-top:4px;font-size:11px;font-weight:800;color:#C2557E;background:#FDE7EF;border-radius:999px;padding:2px 8px}',
    '.qg-row{display:grid;grid-template-columns:1fr 1fr;gap:18px}',
    '.qg-sec .chips{display:flex;flex-wrap:wrap;gap:6px}',
    '.qg-chip{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 12px 4px 5px;background:var(--t);color:#2A2433;text-decoration:none;font-size:13.5px}.qg-chip b{font-weight:700}.qg-chip small{font-size:11.5px;opacity:.65}',
    '.qg-chip img{border-radius:50%;background:rgba(255,255,255,.75)}a.qg-chip:hover{box-shadow:0 0 0 2px var(--tb)}',
    '.qg-chip.add{background:none;border:1.5px dashed var(--_line);color:var(--_muted);padding:4px 12px;font-weight:700}a.qg-chip.add:hover{border-color:var(--_ink);color:var(--_ink);box-shadow:none}',
    '.qk-org .empty{margin:0;font-size:13px;color:var(--_muted)}',
    // 지역연구회
    '.qk-rg{display:flex;flex-direction:column;gap:18px;min-width:0}',
    '.qr-hero{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px;align-items:center;border:1px solid var(--_line);border-radius:26px;background:var(--_surface);padding:30px 34px 28px}',
    '.qr-hero .art{position:relative;height:256px}.qr-hero .f{position:absolute;border-radius:50%;background:var(--t);display:grid;place-items:center;box-shadow:0 0 0 5px var(--_surface)}.qr-hero .f img{width:84%;height:auto}',
    '.qr-hero .f0{left:84px;top:44px;width:132px;height:132px;z-index:2}.qr-hero .f1{left:0;top:0;width:92px;height:92px}.qr-hero .f2{left:198px;top:6px;width:100px;height:100px}.qr-hero .f3{left:10px;top:152px;width:96px;height:96px}.qr-hero .f4{left:184px;top:150px;width:104px;height:104px}',
    '.qr-hero .eb{margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:.08em;color:var(--_muted)}',
    '.qr-hero h2{margin:0;font-size:clamp(26px,4vw,38px);line-height:1.22;letter-spacing:-.02em}',
    '.qr-hero p{margin:12px 0 0;font-size:15px;color:var(--_muted);max-width:560px;line-height:1.6}',
    '.qr-hero .st{display:flex;gap:20px;flex-wrap:wrap;margin:18px 0}.qr-hero .st span{font-size:13px;color:var(--_muted)}.qr-hero .st b{font-size:24px;color:var(--_ink);margin-right:3px;font-variant-numeric:tabular-nums}',
    '.qr-hero .qk-cta{padding:11px 22px;font-size:15px}',
    '.qr-hub{display:grid;grid-template-columns:auto minmax(0,1fr);gap:22px;align-items:start}',
    '.qr-map{border:1px solid var(--_line);border-radius:22px;background:var(--_surface);padding:18px;position:sticky;top:12px}',
    '.qr-tiles{display:grid;grid-template-columns:repeat(5,58px);grid-template-rows:repeat(6,58px);gap:6px}',
    '.qk .qr-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;border:1.5px solid var(--_line);border-radius:14px;background:var(--_surface);cursor:pointer;color:var(--_muted);padding:2px;transition:transform .15s;min-width:0}',
    '.qr-tile:hover{transform:translateY(-2px)}.qr-tile b{font-size:12.5px;line-height:1.2}.qr-tile small{font-size:10px;font-weight:800;line-height:1.2}.qr-tile .pl{font-size:15px;opacity:.45}',
    '.qk .qr-tile.on{background:var(--t);border-color:transparent;color:#2A2433}.qr-tile.on small{color:var(--ti)}',
    '.qk .qr-tile.prep{border-style:dashed;border-color:#F2A3BE;color:#C2557E}.qk .qr-tile.sel{box-shadow:0 0 0 2.5px var(--_ink)}',
    '.qr-legend{margin:12px 0 0;font-size:11.5px;color:var(--_muted);display:flex;align-items:center;gap:5px;flex-wrap:wrap;max-width:314px;line-height:1.6}',
    '.qr-legend .k{width:12px;height:12px;border-radius:4px;border:1.5px solid var(--_line);display:inline-block;box-sizing:border-box}.qr-legend .k.on{background:#E1F5EE;border-color:#82D4BE}.qr-legend .k.prep{border-style:dashed;border-color:#F2A3BE}',
    '.qr-list{display:flex;flex-direction:column;gap:8px;min-width:0}.qr-lh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:2px}.qr-lh h3{margin:0;font-size:17px}',
    '.qk .qr-card{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:center;border:1px solid var(--_line);border-radius:20px;background:var(--_surface);padding:14px 16px;cursor:pointer;color:var(--_ink);text-align:left;transition:transform .15s,box-shadow .15s}',
    '.qr-card:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(30,20,40,.06)}.qr-card.prep{border-style:dashed}',
    '.qr-card img{border-radius:50%;background:var(--t)}.qr-card .tx{display:flex;flex-direction:column;gap:2px;min-width:0}',
    '.qr-card .t{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.qr-card b{font-size:16px}.qr-card em{font-style:normal;font-size:11px;font-weight:800;color:var(--ti);background:var(--t);border-radius:999px;padding:1px 8px}',
    '.qr-card .i{font-size:12.5px;color:var(--_muted)}.qr-card .nx{font-size:13px;font-weight:600}',
    '.qk .qr-open{display:flex;flex-direction:column;gap:3px;align-items:flex-start;border:1.5px dashed var(--_line);border-radius:20px;background:none;padding:16px;cursor:pointer;color:var(--_ink);text-align:left}.qr-open b{font-size:15px}.qr-open span{font-size:12.5px;color:var(--_muted)}.qk .qr-open:hover{border-color:var(--_ink)}',
    '.qr-empty{margin:0;padding:18px;text-align:center;color:var(--_muted);font-size:13.5px}',
    '.qr-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}',
    '.qk .qr-back{display:inline-flex;align-items:center;gap:2px;border:0;background:var(--_soft);border-radius:999px;padding:6px 14px 6px 8px;font-size:13.5px;font-weight:700;cursor:pointer;color:var(--_ink)}',
    '.qk .qr-demo{border:1.5px dashed var(--_line);background:none;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:700;cursor:pointer;color:var(--_muted)}.qk .qr-demo[aria-pressed="true"]{border-style:solid;border-color:var(--_ink);color:var(--_ink)}',
    '.qr-prep{margin:0;font-size:13px;font-weight:600;color:#C2557E;background:#FDE7EF;border-radius:12px;padding:10px 14px}',
    '.qr-head{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:22px;align-items:center;border-radius:26px;background:var(--t);padding:24px 28px;color:#2A2433}',
    '.qr-head .fc{width:132px;height:132px;border-radius:50%;background:rgba(255,255,255,.75);display:grid;place-items:center;overflow:hidden}',
    '.qr-head .eb{margin:0;font-size:12.5px;font-weight:800;color:var(--ti)}.qr-head h2{margin:2px 0 0;font-size:clamp(24px,3.4vw,34px);letter-spacing:-.02em}',
    '.qr-head .in{margin:6px 0 0;font-size:15px;line-height:1.55;color:rgba(42,36,51,.78)}',
    '.qr-head .off{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.qr-head .off > span{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.82);border-radius:999px;padding:3px 12px 3px 3px}',
    '.qr-head .off span span{display:flex;flex-direction:column;line-height:1.15}.qr-head .off small{font-size:10.5px;color:rgba(42,36,51,.6);font-weight:700}.qr-head .off b{font-size:13px}',
    '.qr-head .nums{display:flex;flex-direction:column;gap:10px}.qr-head .nums span{display:flex;flex-direction:column;font-size:12px;font-weight:700;color:rgba(42,36,51,.62);text-align:right}.qr-head .nums b{font-size:30px;color:#2A2433;font-variant-numeric:tabular-nums;line-height:1.1}',
    '.qk .qr-head .edit{margin-top:14px;background:#2A2433;color:#fff;border-color:#2A2433}',
    '.qr-cols{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px;align-items:start}.qr-l,.qr-r{display:flex;flex-direction:column;gap:14px;min-width:0}',
    '.qr-next{display:grid;grid-template-columns:auto minmax(0,1fr);gap:18px;border:1px solid var(--_line);border-radius:22px;background:var(--_surface);padding:20px}.qr-next.none{grid-template-columns:1fr}',
    '.qr-next .dt{width:92px;border-radius:18px;background:var(--_soft);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 0;align-self:start}',
    '.qr-next .dt small{font-size:13px;font-weight:700;color:var(--_muted)}.qr-next .dt b{font-size:38px;line-height:1.05;font-variant-numeric:tabular-nums}.qr-next .dt .dd{font-size:11.5px;font-weight:800;color:#C2557E}',
    '.qr-next .h{margin:0;font-size:12px;font-weight:800;color:var(--_muted)}.qr-next h3{margin:2px 0 0;font-size:20px;word-break:keep-all}.qr-next .w{margin:4px 0 0;font-size:14px;color:var(--_muted)}',
    '.qr-next .go{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:14px}.qr-next .qk-cta{align-self:auto;padding:10px 22px;font-size:15px}',
    '.qr-next .who{display:flex;align-items:center}.qr-next .who > span{margin-left:-6px;line-height:0}.qr-next .who > span:first-child{margin-left:0}.qr-next .who img{box-shadow:0 0 0 2px var(--_surface)}.qr-next .who em{font-style:normal;font-size:12.5px;color:var(--_muted);margin-left:8px}',
    '.qr-edit{grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap;border-top:1px dashed var(--_line);padding-top:12px}',
    '.qr-box{border:1px solid var(--_line);border-radius:20px;background:var(--_surface);padding:16px 18px}.qr-box .hd{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}.qr-box h4{margin:0;font-size:16px}',
    '.qr-box ol,.qr-links{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
    '.qr-box ol li{position:relative;display:grid;grid-template-columns:78px minmax(0,1fr);gap:12px;padding:10px 26px 10px 0;border-top:1px solid var(--_line)}.qr-box ol li:first-child{border-top:0}',
    '.qr-box ol .dt{font-size:12.5px;font-weight:700;color:var(--_muted);padding-top:2px}.qr-box ol b{font-size:14.5px}.qr-box ol p{margin:3px 0 0;font-size:13.5px;color:var(--_muted);line-height:1.55;white-space:pre-wrap;word-break:keep-all}',
    '.qr-box li.empty{display:block;padding:8px 0;font-size:13px;color:var(--_muted);border:0}',
    '.qr-links li{position:relative;display:flex;flex-direction:column;padding:8px 26px 8px 0;border-top:1px solid var(--_line)}.qr-links li:first-child{border-top:0}',
    '.qr-links a{font-weight:700;font-size:14px;color:var(--_ink);text-decoration:none}.qr-links a:hover{text-decoration:underline}.qr-links small{font-size:12px;color:var(--_muted)}',
    '.qk .qr-box .x{position:absolute;top:8px;right:0;border:0;background:none;font-size:18px;line-height:1;cursor:pointer;color:var(--_muted);padding:2px 4px}',
    '.qr-contact p{margin:0;font-size:13px;line-height:1.6;color:var(--_muted)}',
    '@media (max-width:860px){.qo-body{grid-template-columns:1fr}.qo-rail{position:static;flex-direction:row;overflow-x:auto;max-height:none;gap:4px;padding:0 0 4px;scrollbar-width:none}.qo-rail::-webkit-scrollbar{display:none}.qo-rh{display:none}' +
      '.qk .qo-ri{border:1px solid var(--_line);padding:3px 10px 3px 4px;border-radius:999px;font-size:13px}.qo-ri .nm{overflow:visible}' +
      '.qo-grid2{grid-template-columns:1fr}.qo-sum{grid-template-columns:repeat(2,minmax(0,1fr))}.qo-board{grid-template-columns:repeat(3,86%);overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:4px}.qo-col{scroll-snap-align:start}' +
      '.qo-head{grid-template-columns:auto minmax(0,1fr)}.qo-head .ac{grid-column:1/-1;flex-direction:row;flex-wrap:wrap}.qo-rg{grid-template-columns:auto minmax(0,1fr) auto}.qo-rg .a{grid-column:1/-1}.qo-3{grid-template-columns:1fr}' +
      '.qg-row{grid-template-columns:1fr}.qr-hub{grid-template-columns:1fr}.qr-map{position:static;display:flex;flex-direction:column;align-items:center}.qr-cols{grid-template-columns:1fr}' +
      '.qr-head{grid-template-columns:auto minmax(0,1fr);padding:20px;gap:16px}.qr-head .fc{width:84px;height:84px}.qr-head .fc img{width:84px;height:84px}.qr-head .nums{grid-column:1/-1;flex-direction:row;gap:28px}.qr-head .nums span{text-align:left}.qr-hero{padding:24px 20px;grid-template-columns:1fr}.qr-hero .art{display:none}.qr-box ol li{grid-template-columns:1fr;gap:2px}}',
    '@media (max-width:420px){.qr-tiles{grid-template-columns:repeat(5,52px);grid-template-rows:repeat(6,52px);gap:5px}.qr-tile.on img{width:22px;height:22px}.qr-next{grid-template-columns:1fr}.qr-next .dt{flex-direction:row;gap:8px;width:auto;padding:8px 14px;align-items:baseline;justify-content:flex-start}.qr-next .dt b{font-size:26px}.qr-map{padding:14px}}',
    '@media (prefers-reduced-motion:reduce){.qk-toast,.qk-sheet[open],.qk-post-side .lk.on svg{animation:none!important}.qk-poll-opt .fill{transition:none}}',
    '@media (prefers-reduced-motion:reduce){.qk-bar .b,.qk-ev-chev,.qk-nav-cta{transition:none!important}}',
    '@media (prefers-reduced-motion:reduce){quoka-icon .qmv,.qi-badge,.qk-spot,.qk-login.shake,.qk-say .cur{animation:none!important}quoka-icon svg,.qk-nav-item{transition:none!important}}',
    '@media (prefers-reduced-motion:reduce){.qk *{animation:none!important;transition:none!important}}',
    '@media (max-width:640px){.qk-ci,.qk-badges{grid-template-columns:1fr}.qk-moods{grid-template-columns:repeat(4,minmax(0,1fr))}.qk-shelf{grid-template-columns:repeat(2,minmax(0,1fr))}}'
  ].join('\n');
  function ensureStyle() {
    if (typeof document === 'undefined' || document.getElementById('qk-style')) return;
    var s = document.createElement('style'); s.id = 'qk-style'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function faceImg(opts, size, alt) {
    var i = document.createElement('img');
    i.width = size; i.height = size; i.alt = alt || ''; i.decoding = 'async';
    i.src = Q.url(opts);
    return i;
  }
  function seedHash(s) { var h = 2166136261; String(s).split('').forEach(function (c) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }); return h; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // 스크립트를 <head>에서 불러도 안쪽 자식(<a>, <p>)을 다 읽은 뒤에 그리게 한다
  function whenParsed(fn) {
    if (typeof document !== 'undefined' && document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }
  function define(name, cls) { if (root.customElements && !root.customElements.get(name)) root.customElements.define(name, cls); }
  var Base = typeof HTMLElement !== 'undefined' ? HTMLElement : function () {};

  // ── 1. 아바타 ──────────────────────────────────────────────────
  class QuokaAvatar extends Base {
    static get observedAttributes() { return ['seed', 'size', 'motion', 'label', 'group']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var seed = this.getAttribute('seed') || '쿼카', size = parseInt(this.getAttribute('size'), 10) || 48;
      var tones = ['#FFE3EC', '#DDF5EC', '#F6ECDD', '#FCEAD9'];
      var g = findGroup(this.getAttribute('group') || seed);
      var motion = this.getAttribute('motion') || 'none';
      var o = g ? Object.assign({}, g.face, { motion: motion }) : Q.fromSeed(seed, { motion: motion });
      this.className = 'qk';
      this.innerHTML = '';
      var box = el('div', 'qk-av'); box.style.width = size + 'px'; box.style.height = size + 'px';
      box.style.background = g ? TONE_BG[g.tone] : tones[seedHash(seed) % tones.length];
      box.appendChild(faceImg(o, size, this.getAttribute('label') || ((g ? g.name : seed) + '의 쿼카')));
      this.appendChild(box);
    }
  }

  // ── 2. 화면 상태 ───────────────────────────────────────────────
  // 버튼 같은 자식 요소는 그대로 두고 <slot>으로 보여 준다(React가 자식을 다시 그려도 안전하다).
  var STATE_CSS = ':host{display:block}' + CSS.split('\n').filter(function (r) { return /^\.qk\{|qk-state|qk-dots|qkdot|\.qk-text/.test(r); }).join('\n') +
    '\n.qk-state ::slotted(*){margin:0}\n.qk img{display:block;max-width:100%}\n@media (prefers-reduced-motion:reduce){*{animation:none!important}}';
  class QuokaState extends Base {
    static get observedAttributes() { return ['type', 'heading', 'desc', 'size', 'compact']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var t = STATES[this.getAttribute('type')] || STATES.empty;
      var compact = this.hasAttribute('compact');
      var size = parseInt(this.getAttribute('size'), 10) || (compact ? 56 : 120);
      var sr = this.shadowRoot || this.attachShadow({ mode: 'open' });
      sr.innerHTML = '<style>' + STATE_CSS + '</style>';
      var box = el('div', 'qk qk-state' + (compact ? ' compact' : ''));
      box.setAttribute('role', this.getAttribute('type') === 'loading' ? 'status' : 'group');
      box.appendChild(faceImg(Object.assign({ delay: 'auto' }, t.face), size, ''));
      var text = el('div', 'qk-text');
      text.appendChild(el('b', '', esc(this.getAttribute('heading') || t.heading) + (t.dots ? '<span class="qk-dots" aria-hidden="true"><i></i><i></i><i></i></span>' : '')));
      text.appendChild(el('p', '', esc(this.getAttribute('desc') || t.desc)));
      box.appendChild(text);
      box.appendChild(el('div', 'qk-actions', '<slot></slot>'));
      sr.appendChild(box);
    }
  }

  // ── 3. 마음 체크인 ─────────────────────────────────────────────
  // .responses = ['happy','tired',...] 로 다른 선생님들 응답을 넣는다. 고르고 남기면 'checkin' 이벤트(detail.mood).
  class QuokaCheckin extends Base {
    constructor() { super(); this._responses = []; this._pick = 'calm'; this._sent = false; }
    get responses() { return this._responses.slice(); }
    set responses(v) { this._responses = (v || []).filter(function (m) { return Q.expressions[m] && Q.expressions[m].mood; }); if (this.isConnected) this.renderCrowd(); }
    connectedCallback() {
      ensureStyle();
      if (this.hasAttribute('responses')) { try { this._responses = JSON.parse(this.getAttribute('responses')); } catch (e) { /* 무시 */ } }
      this.render();
    }
    render() {
      var self = this;
      this.className = 'qk';
      this.innerHTML = '';
      var wrap = el('div', 'qk-ci');
      var left = el('div');
      left.appendChild(el('h4', '', esc(this.getAttribute('heading') || '오늘 마음은 어때요?')));
      var now = el('div', 'qk-now');
      this._big = faceImg({ expression: this._pick, motion: 'idle' }, 112, '');
      now.appendChild(this._big);
      this._nowText = el('div');
      now.appendChild(this._nowText);
      left.appendChild(now);
      var moods = el('div', 'qk-moods'); moods.setAttribute('role', 'group'); moods.setAttribute('aria-label', '오늘 마음 고르기');
      this._buttons = Q.moods.map(function (m) {
        var b = el('button', 'qk-mood'); b.type = 'button';
        b.appendChild(faceImg({ expression: m }, 44, ''));
        b.appendChild(document.createTextNode(Q.expressions[m].label));
        b.addEventListener('click', function () { self.pick(m); });
        moods.appendChild(b);
        return b;
      });
      left.appendChild(moods);
      this._send = el('button', 'qk-cta', '마음 남기기'); this._send.type = 'button';
      this._send.addEventListener('click', function () {
        if (self._sent) return;
        self._sent = true;
        self._responses.push(self._pick);
        self._send.disabled = true; self._send.textContent = '남겼어요. 고마워요!';
        self.renderCrowd();
        self.dispatchEvent(new CustomEvent('checkin', { detail: { mood: self._pick }, bubbles: true }));
      });
      left.appendChild(this._send);
      var right = el('div');
      right.appendChild(el('h4', '', '오늘 우리 마음'));
      this._crowd = el('div', 'qk-crowd'); right.appendChild(this._crowd);
      this._note = el('p', 'qk-note'); right.appendChild(this._note);
      wrap.appendChild(left); wrap.appendChild(right);
      this.appendChild(wrap);
      this.pick(this._pick, true);
      this.renderCrowd();
    }
    pick(m, silent) {
      if (this._sent && !silent) return;
      this._pick = m;
      this._big.src = Q.url({ expression: m, motion: m === 'excited' ? 'aha' : 'idle' });
      this._big.alt = Q.expressions[m].label + ' 표정의 쿼카';
      this._nowText.innerHTML = '<b>' + esc(Q.expressions[m].label) + '</b><small>' + esc(Q.expressions[m].note) + '</small>';
      this._buttons.forEach(function (b, i) { b.setAttribute('aria-pressed', String(Q.moods[i] === m)); });
    }
    renderCrowd() {
      var self = this, counts = {}, total = this._responses.length;
      Q.moods.forEach(function (m) { counts[m] = 0; });
      this._responses.forEach(function (m) { counts[m]++; });
      this._crowd.innerHTML = '';
      Q.moods.forEach(function (m) {
        var row = el('div', 'qk-crowd-row');
        row.appendChild(el('span', '', esc(Q.expressions[m].label)));
        var faces = el('div', 'faces');
        for (var i = 0; i < Math.min(counts[m], 14); i++) faces.appendChild(faceImg({ expression: m }, 26, ''));
        row.appendChild(faces);
        row.appendChild(el('em', '', String(counts[m])));
        self._crowd.appendChild(row);
      });
      var heavy = counts.tired + counts.worried + counts.sad;
      this._note.textContent = total === 0 ? '아직 남긴 마음이 없어요. 첫 마음을 남겨 주세요.'
        : (heavy / total >= 0.3
          ? total + '명이 마음을 남겼어요. 지친 마음이 꽤 보이네요. 오늘은 서로 조금 더 살펴봐요.'
          : total + '명이 마음을 남겼어요. 숫자는 평가가 아니라, 서로를 더 잘 살피기 위한 신호예요.');
    }
  }

  // ── 4. 활동 기록 아이템 ────────────────────────────────────────
  // earned="sprout pencil ..." · wear="pencil" · name="햇살쌤". 아이템을 고르면 'wear' 이벤트(detail.item).
  class QuokaBadges extends Base {
    static get observedAttributes() { return ['earned', 'wear', 'name']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this;
      var earned = (this.getAttribute('earned') || '').split(/[\s,]+/).filter(Boolean);
      var wear = this.getAttribute('wear') || earned[0] || '';
      var name = this.getAttribute('name') || '나';
      this.className = 'qk';
      this.innerHTML = '';
      var wrap = el('div', 'qk-badges');
      var me = el('div', 'qk-me');
      me.appendChild(faceImg({ expression: 'smile', accessory: wear || undefined, motion: 'idle' }, 150, name + '의 쿼카'));
      me.appendChild(el('b', '', esc(name)));
      me.appendChild(el('small', '', BADGES.length + '개 중 ' + earned.length + '개를 함께 쌓았어요'));
      var right = el('div');
      right.appendChild(el('h4', '', '함께 쌓은 기록'));
      var shelf = el('div', 'qk-shelf'); shelf.style.marginTop = '12px';
      BADGES.forEach(function (bd) {
        var got = earned.indexOf(bd.key) >= 0;
        var b = el('button', 'qk-badge' + (got ? '' : ' locked')); b.type = 'button';
        if (!got) b.disabled = true;
        b.setAttribute('aria-pressed', String(got && bd.key === wear));
        b.appendChild(faceImg({ expression: 'smile', accessory: bd.key }, 72, ''));
        b.appendChild(el('b', '', esc(bd.title)));
        b.appendChild(el('small', '', got ? esc(bd.desc) : '아직이에요 · ' + esc(bd.desc)));
        b.addEventListener('click', function () {
          if (!got) return;
          self.setAttribute('wear', bd.key);
          self.dispatchEvent(new CustomEvent('wear', { detail: { item: bd.key }, bubbles: true }));
        });
        shelf.appendChild(b);
      });
      right.appendChild(shelf);
      wrap.appendChild(me); wrap.appendChild(right);
      this.appendChild(wrap);
    }
  }

  // ── 5. 월별 로드맵 ─────────────────────────────────────────────
  class QuokaRoadmap extends Base {
    constructor() { super(); this._months = null; }
    get months() { return (this._months || ROADMAP_EXAMPLE).slice(); }
    set months(v) { this._months = v; if (this.isConnected) this.render(); }
    static get observedAttributes() { return ['month']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var cur = parseInt(this.getAttribute('month'), 10) || (new Date().getMonth() + 1);
      this.className = 'qk';
      this.innerHTML = '';
      var road = el('div', 'qk-road'); road.setAttribute('role', 'list');
      var nowCard = null;
      this.months.forEach(function (m) {
        var c = el('div', 'qk-month' + (m.month === cur ? ' now' : (m.month < cur ? ' past' : '')));
        c.setAttribute('role', 'listitem');
        c.appendChild(el('span', 'm', m.month + '월' + (m.month === cur ? ' · 이번 달' : '')));
        c.appendChild(faceImg({ expression: m.expression || (m.month === cur ? 'excited' : 'smile'), accessory: m.item, motion: m.month === cur ? 'aha' : 'none' }, 84, ''));
        c.appendChild(el('b', '', esc(m.title)));
        if (m.desc) c.appendChild(el('small', '', esc(m.desc)));
        road.appendChild(c);
        if (m.month === cur) nowCard = c;
      });
      this.appendChild(road);
      if (nowCard) requestAnimationFrame(function () { road.scrollLeft = Math.max(0, nowCard.offsetLeft - road.offsetLeft - 8); });
    }
  }

  // ── 6. 아이콘 ──────────────────────────────────────────────────
  // <quoka-icon name="bell" size="40" label="알림" badge="3" animate="loop|none">  · el.play() 로 한 번 움직이기
  function iconSvg(name, opts) {
    var draw = ICONS[name] || GROUP_ICONS[name];
    if (!draw) return '';
    var body = draw();
    if (!(opts && opts.still)) body = addMotion(name, body);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true">' + body + '</svg>';
  }
  class QuokaIcon extends Base {
    static get observedAttributes() { return ['name', 'size', 'label', 'badge']; }
    connectedCallback() { ensureStyle(); this.render(); this._ready = true; }
    attributeChangedCallback(n, old) {
      if (!this.isConnected) return;
      if (n === 'badge') this.renderBadge(old); else if (n === 'label') this.updateLabel(); else this.render();
    }
    size() { return parseInt(this.getAttribute('size'), 10) || 40; }
    render() {
      var size = this.size();
      this.style.width = size + 'px'; this.style.height = size + 'px';
      this.innerHTML = iconSvg(this.getAttribute('name'));
      this._badge = null;
      this.renderBadge(null);
    }
    renderBadge(old) {
      var v = this.getAttribute('badge');
      if (this._badge) { this._badge.remove(); this._badge = null; }
      if (v != null && v !== '' && v !== '0') {
        var dot = v === 'dot';
        var sz = this.size(), small = sz < 34;
        var b = el('span', 'qi-badge' + (dot ? ' dot' : '') + (small ? ' sm' : ''), dot ? '' : esc(+v > 99 ? '99+' : v));
        b.setAttribute('aria-hidden', 'true');
        b.style.fontSize = (small ? 9 : Math.max(10, Math.round(sz * 0.27))) + 'px';
        this.appendChild(b); this._badge = b;
        if (this._ready && v !== old && !(+v < +old)) { b.classList.add('qi-new'); this.play(); } // 새 소식이면 아이콘도 한 번 움직인다
      }
      this.updateLabel();
    }
    updateLabel() {
      var label = this.getAttribute('label'), v = this.getAttribute('badge');
      if (!label) return;
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', label + (v && v !== '0' ? (v === 'dot' ? ', 새 소식 있음' : ', 새 소식 ' + v + '개') : ''));
    }
    play() {
      var self = this;
      this.classList.remove('qi-play'); void this.offsetWidth; this.classList.add('qi-play');
      clearTimeout(this._pt); this._pt = setTimeout(function () { self.classList.remove('qi-play'); }, 2100);
    }
  }

  // ── 8. 메뉴바 ──────────────────────────────────────────────────
  // <quoka-nav active="archive" brand="쿼카연구회"><a href="/archive" data-icon="archive" data-badge="3">자료실</a>…</quoka-nav>
  // 또는 el.items = [{ key, label, href, icon, badge }]. mode: auto(넓으면 위 메뉴·좁으면 아래 탭) · top · tab · grid(바로가기 타일)
  // 메뉴를 누르면 'navigate' 이벤트(detail.key). preventDefault()하면 이동하지 않는다(React 라우터용). el.setBadge('bell', 3)
  var MORE_SVG = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="17" cy="32" r="6" fill="' + IC.p + '"/><circle cx="32" cy="32" r="6" fill="' + IC.y + '"/><circle cx="47" cy="32" r="6" fill="' + IC.m + '"/></svg>';
  function navItem(x) {
    x = x || {};
    var key = x.key || x.icon || x.label;
    return { key: key, label: x.label || (ICON_META[key] ? ICON_META[key][0] : key), href: x.href || '', icon: x.icon || key, badge: x.badge == null ? '' : String(x.badge), group: x.group || '' };
  }
  class QuokaNav extends Base {
    constructor() { super(); this._items = null; this._mq = null; }
    static get observedAttributes() { return ['active', 'mode', 'brand', 'brand-href', 'tabs']; }
    get items() { return (this._items || []).map(function (x) { return Object.assign({}, x); }); }
    set items(v) { this._items = (v || []).map(navItem); if (this.isConnected) this.render(); }
    connectedCallback() {
      ensureStyle();
      var self = this;
      whenParsed(function () { if (self.isConnected) self.init(); });
    }
    init() {
      var self = this;
      if (!this._items) {
        var j = this.getAttribute('items');
        if (j) { try { this._items = JSON.parse(j).map(navItem); } catch (e) { /* 무시 */ } }
        if (!this._items) this._items = Array.prototype.map.call(this.querySelectorAll('a'), function (a) {
          return navItem({ key: a.dataset.key || a.dataset.icon, label: a.textContent.trim(), href: a.getAttribute('href'), icon: a.dataset.icon, badge: a.dataset.badge, group: a.dataset.group });
        });
      }
      if (!this._mq && root.matchMedia) {
        this._mq = root.matchMedia('(max-width: ' + (parseInt(this.getAttribute('breakpoint'), 10) || 720) + 'px)');
        this._onMq = function () { var m = self.getAttribute('mode') || 'auto'; if (m === 'auto' || m === 'side') self.render(); };
        if (this._mq.addEventListener) this._mq.addEventListener('change', this._onMq);
      }
      this._onDoc = function (e) { if (self._sheet && !self._sheet.hidden && !self.contains(e.target)) self.toggleSheet(false); };
      document.addEventListener('pointerdown', this._onDoc);
      this.render();
    }
    disconnectedCallback() {
      if (this._mq && this._mq.removeEventListener) this._mq.removeEventListener('change', this._onMq);
      this._mq = null;
      document.removeEventListener('pointerdown', this._onDoc);
    }
    attributeChangedCallback(n) {
      if (!this.isConnected || !this._items) return;
      if (n === 'active') this.updateActive(true); else this.render();
    }
    mode() {
      var m = this.getAttribute('mode') || 'auto', narrow = this._mq && this._mq.matches;
      if (m === 'auto') return narrow ? 'tab' : 'top';
      if (m === 'side' && narrow) return 'tab'; // 사이드 메뉴는 휴대폰에서 아래 탭이 된다
      return m;
    }
    render() {
      var self = this, mode = this.mode(), tabs = parseInt(this.getAttribute('tabs'), 10) || 4;
      var items = this._items || [], more = mode === 'tab' && items.length > tabs + 1;
      var isize = mode === 'grid' ? 46 : (mode === 'tab' ? 26 : (mode === 'side' ? 26 : 24));
      this.className = 'qk';
      this.innerHTML = '';
      var nav = el('nav', 'qk-nav ' + mode);
      nav.setAttribute('aria-label', this.getAttribute('label') || '주 메뉴');
      var brand = this.getAttribute('brand');
      if (brand && (mode === 'top' || mode === 'side')) {
        var b = el('a', 'qk-nav-brand');
        b.href = this.getAttribute('brand-href') || '#';
        var f = document.createElement('quoka-face');
        f.setAttribute('follow', ''); f.setAttribute('expression', this.getAttribute('brand-expression') || 'smile'); f.setAttribute('size', mode === 'side' ? '42' : '34');
        if (this.getAttribute('brand-accessory')) f.setAttribute('accessory', this.getAttribute('brand-accessory'));
        b.appendChild(f);
        b.appendChild(el('span', '', esc(brand) + (mode === 'side' && this.getAttribute('brand-sub') ? '<small>' + esc(this.getAttribute('brand-sub')) + '</small>' : '')));
        nav.appendChild(b);
      }
      var list = el('div', 'qk-nav-list');
      var make = function (x, i, big) {
        var a = el(x.href ? 'a' : 'button', 'qk-nav-item' + (more && i >= tabs ? ' extra' : ''));
        if (x.href) a.href = x.href; else a.type = 'button';
        a.dataset.key = x.key;
        var ic = el('span', 'ic'), icon = document.createElement('quoka-icon');
        icon.setAttribute('name', x.icon); icon.setAttribute('size', String(big || isize));
        if (x.badge && x.badge !== '0') icon.setAttribute('badge', x.badge);
        ic.appendChild(icon); a.appendChild(ic);
        a.appendChild(el('span', 'lb', esc(x.label)));
        if (x.badge && x.badge !== '0' && x.badge !== 'dot') a.setAttribute('aria-label', x.label + ', 새 소식 ' + x.badge + '개');
        a.addEventListener('click', function (e) { self.choose(x, e); });
        return a;
      };
      var bottom = mode === 'side' ? el('div', 'qk-nav-list qk-nav-bottom') : null;
      items.forEach(function (x, i) { (bottom && x.group === 'bottom' ? bottom : list).appendChild(make(x, i)); });
      nav.appendChild(list);
      if (mode === 'side' && this.getAttribute('cta')) { // 빠른 등록 같은 큰 단추. 누르면 'cta' 이벤트, cta-href가 있으면 이동
        var cta = el(this.getAttribute('cta-href') ? 'a' : 'button', 'qk-nav-cta', '<span aria-hidden="true">+</span>' + esc(this.getAttribute('cta')));
        if (this.getAttribute('cta-href')) cta.href = this.getAttribute('cta-href'); else cta.type = 'button';
        cta.addEventListener('click', function () { self.dispatchEvent(new CustomEvent('cta', { bubbles: true })); });
        nav.appendChild(cta);
      }
      if (bottom && bottom.children.length) nav.appendChild(bottom);
      this._sheet = null;
      if (more) {
        var mb = el('button', 'qk-nav-item qk-nav-more', '<span class="ic"><span class="qk-more-ic">' + MORE_SVG + '<i class="qk-more-dot" hidden></i></span></span><span class="lb">더보기</span>');
        mb.type = 'button'; mb.setAttribute('aria-expanded', 'false');
        mb.addEventListener('click', function () { self.toggleSheet(); });
        list.appendChild(mb);
        var sheet = el('div', 'qk-nav-sheet'); sheet.hidden = true;
        items.slice(tabs).forEach(function (x, i) { sheet.appendChild(make(x, i + tabs, 34)); });
        nav.appendChild(sheet);
        this._sheet = sheet; this._moreBtn = mb;
      }
      this.appendChild(nav);
      this.updateActive(false);
      this.updateMoreDot();
    }
    updateMoreDot() { // 더보기 안에 새 소식이 있으면 점을 찍는다
      if (!this._moreBtn) return;
      var tabs = parseInt(this.getAttribute('tabs'), 10) || 4;
      this._moreBtn.querySelector('.qk-more-dot').hidden = !(this._items || []).slice(tabs).some(function (x) { return x.badge && x.badge !== '0'; });
    }
    toggleSheet(on) {
      if (!this._sheet) return;
      var show = on == null ? this._sheet.hidden : on;
      this._sheet.hidden = !show;
      this._moreBtn.setAttribute('aria-expanded', String(show));
    }
    choose(x, e) {
      var ev = new CustomEvent('navigate', { detail: { key: x.key, href: x.href, item: Object.assign({}, x) }, bubbles: true, cancelable: true });
      this.dispatchEvent(ev);
      if (ev.defaultPrevented) { e.preventDefault(); return; }
      if (!x.href || x.href.charAt(0) === '#') { if (!x.href) e.preventDefault(); this.setAttribute('active', x.key); }
      this.toggleSheet(false);
    }
    updateActive(play) {
      var act = this.getAttribute('active'), moreHit = false;
      Array.prototype.forEach.call(this.querySelectorAll('.qk-nav-item[data-key]'), function (a) {
        var on = a.dataset.key === act;
        if (on) { a.setAttribute('aria-current', 'page'); if (play) { var i = a.querySelector('quoka-icon'); if (i && i.play) i.play(); } if (a.closest('.qk-nav-sheet')) moreHit = true; }
        else a.removeAttribute('aria-current');
      });
      if (this._moreBtn) this._moreBtn.classList.toggle('has-active', moreHit);
    }
    setBadge(key, v) {
      (this._items || []).forEach(function (x) { if (x.key === key) x.badge = v == null ? '' : String(v); });
      Array.prototype.forEach.call(this.querySelectorAll('.qk-nav-item[data-key="' + key + '"] quoka-icon'), function (i) {
        if (v == null || v === '' || v === 0 || v === '0') i.removeAttribute('badge'); else i.setAttribute('badge', String(v));
      });
      this.updateMoreDot();
    }
  }

  // ── 9. 쿼카 도우미 ─────────────────────────────────────────────
  // <quoka-guide><p data-expression="idea" data-target="#menu">말 한 마디</p>…</quoka-guide> 또는 el.steps = [{ text, expression, target }]
  // 말풍선에 글자가 찍히는 동안 입이 움직인다. data-target이 있으면 그곳을 반짝 표시하고 쿼카가 그쪽을 본다.
  // floating: 화면 오른쪽 아래에 떠 있고, 접으면 동그란 쿼카 단추가 된다. minimized: 접힌 채로 시작.
  // 이벤트: step(detail.index) · done
  var guideSeq = 0;
  class QuokaGuide extends Base {
    constructor() { super(); this._steps = null; this._i = -1; this._t = 0; this._typing = false; this._started = false; }
    static get observedAttributes() { return ['minimized']; }
    get steps() { return (this._steps || []).slice(); }
    set steps(v) { this._steps = (v || []).map(function (x) { return typeof x === 'string' ? { text: x } : x; }); if (this._built) { this._started = false; this.go(0); } }
    connectedCallback() {
      ensureStyle();
      var self = this;
      if (!this._built) whenParsed(function () { if (self.isConnected && !self._built) self.init(); });
    }
    init() {
      var self = this;
      if (!this._steps) this._steps = Array.prototype.map.call(this.querySelectorAll('p'), function (p) {
        return { text: p.textContent.trim(), expression: p.dataset.expression, target: p.dataset.target };
      });
      this._built = true;
      this.className = 'qk';
      this.innerHTML = '';
      var floating = this.hasAttribute('floating');
      var box = el('div', 'qk-guide');
      box.setAttribute('role', 'group'); box.setAttribute('aria-label', this.getAttribute('label') || '쿼카 도우미');
      var fb = el('div', 'qk-guide-face'), face = document.createElement('quoka-face');
      face.setAttribute('live', ''); face.setAttribute('follow', '');
      face.setAttribute('size', this.getAttribute('size') || (floating ? '76' : '96'));
      face.setAttribute('expression', 'smile'); face.setAttribute('sleep-after', this.getAttribute('sleep-after') || '60');
      if (this.getAttribute('accessory')) face.setAttribute('accessory', this.getAttribute('accessory'));
      face.setAttribute('label', '쿼카 도우미');
      fb.appendChild(face); box.appendChild(fb);
      var bub = el('div', 'qk-bubble');
      var id = 'qkg' + (++guideSeq);
      this._vis = el('p', 'qk-say'); this._vis.setAttribute('aria-hidden', 'true');
      this._sr = el('p', 'qk-sr'); this._sr.setAttribute('aria-live', 'polite'); this._sr.id = id;
      bub.appendChild(this._vis); bub.appendChild(this._sr);
      var bar = el('div', 'qk-guide-bar');
      this._n = el('span', 'n');
      this._prev = el('button', 'qk-gbtn', '이전'); this._prev.type = 'button';
      this._next = el('button', 'qk-gbtn go', '다음'); this._next.type = 'button';
      bar.appendChild(this._n); bar.appendChild(this._prev); bar.appendChild(this._next);
      bub.appendChild(bar);
      if (floating) {
        var x = el('button', 'qk-guide-x', '&times;'); x.type = 'button'; x.setAttribute('aria-label', '도우미 접기');
        x.addEventListener('click', function () { self.setAttribute('minimized', ''); });
        bub.appendChild(x);
      }
      box.appendChild(bub);
      this.appendChild(box);
      var open = el('button', 'qk-guide-open'); open.type = 'button'; open.setAttribute('aria-label', '쿼카 도우미 열기');
      open.appendChild(faceImg({ expression: 'smile', motion: 'idle', accessory: this.getAttribute('accessory') || undefined }, 56, ''));
      open.addEventListener('click', function () { self.removeAttribute('minimized'); });
      this.appendChild(open);
      this._face = face;
      this._prev.addEventListener('click', function () { self.go(self._i - 1); });
      this._next.addEventListener('click', function () {
        if (self._typing) return self.finishTyping();
        if (self._i >= self._steps.length - 1) return self.done();
        self.go(self._i + 1);
      });
      bub.addEventListener('click', function (e) { if (self._typing && !e.target.closest('button')) self.finishTyping(); });
      this.updateBar();
      // 화면에 보일 때 첫 말을 시작한다
      var start = function () { if (!self._started && !self.hasAttribute('minimized')) self.go(0); };
      if (floating || !root.IntersectionObserver) setTimeout(start, 300);
      else {
        this._io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { self._io.disconnect(); start(); } }, { threshold: 0.4 });
        this._io.observe(this);
      }
    }
    disconnectedCallback() { clearTimeout(this._t); this.spot(null); if (this._io) this._io.disconnect(); }
    attributeChangedCallback(n, o, v) {
      if (!this._built) return;
      if (v == null && !this._started) this.go(0);
      if (v != null) { this.finishTyping(); this.spot(null); }
    }
    go(i) {
      var st = this._steps || [];
      if (!st.length) return;
      i = Math.max(0, Math.min(st.length - 1, i));
      this._started = true; this._i = i;
      var step = st[i], face = this._face, self = this;
      if (face.getAttribute('expression') !== (step.expression || 'smile')) face.setAttribute('expression', step.expression || 'smile');
      this.spot(step.target ? document.querySelector(step.target) : null);
      this.type(step.text || '');
      this.updateBar();
      this.dispatchEvent(new CustomEvent('step', { detail: { index: i, step: step }, bubbles: true }));
    }
    spot(t) {
      if (this._spot) this._spot.classList.remove('qk-spot');
      this._spot = t;
      if (!t) return;
      var face = this._face, reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
      for (var dd = t.closest && t.closest('details'); dd; dd = dd.parentElement && dd.parentElement.closest('details')) dd.open = true; // 접힌 칸 안이면 먼저 펼친다
      t.classList.add('qk-spot');
      if (this.hasAttribute('floating')) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () { var r = t.getBoundingClientRect(); if (face.lookAt) face.lookAt(r.left + r.width / 2, r.top + r.height / 2); }, 450);
    }
    type(text) {
      var self = this, face = this._face, i = 0;
      clearTimeout(this._t);
      this._text = text;
      this._sr.textContent = text;
      var reduce = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || !text) { this._vis.textContent = text; this._typing = false; return; }
      this._vis.innerHTML = '<span></span><i class="cur"></i>';
      var sp = this._vis.firstChild;
      this._typing = true;
      if (face.talk) face.talk(true);
      (function tick() {
        i++;
        sp.textContent = text.slice(0, i);
        if (i < text.length) self._t = setTimeout(tick, /[.,!?…~]/.test(text.charAt(i - 1)) ? 190 : 34);
        else self.finishTyping();
      })();
    }
    finishTyping() {
      clearTimeout(this._t);
      if (this._text != null) this._vis.textContent = this._text;
      this._typing = false;
      if (this._face && this._face.talk) this._face.talk(false);
      this.updateBar();
    }
    updateBar() {
      var n = (this._steps || []).length, i = Math.max(0, this._i);
      this._n.textContent = n ? (i + 1) + ' / ' + n : '';
      this._prev.disabled = i <= 0;
      this._next.textContent = i >= n - 1 ? (this.getAttribute('done-label') || '좋아요!') : '다음';
    }
    done() {
      this.spot(null);
      this.dispatchEvent(new CustomEvent('done', { bubbles: true }));
      if (this._face.react) this._face.react('hop');
      if (this.hasAttribute('floating')) { var self = this; setTimeout(function () { self.setAttribute('minimized', ''); self._started = false; self._i = -1; }, 500); }
      else this.go(0);
    }
  }

  // ── 10. 로그인 쿼카 ────────────────────────────────────────────
  // <quoka-login heading="쿼카연구회 로그인" action="/login"> 아이디를 치면 글자를 따라 눈이 움직이고,
  // 비밀번호 칸에서는 선글라스를 내리고 딴 데를 본다. 비밀번호를 보이게 하면 선글라스를 올리고 깜짝.
  // action이 없으면 보내지 않고 'login' 이벤트(detail.id, detail.form)만 낸다. 결과는 el.success('…') / el.fail('…')
  // 이미 있는 입력칸에 붙이려면 QuokaKit.loginBuddy(<quoka-face live follow> 요소, { id, password, toggle })
  var EYE_ON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_OFF = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  function loginBuddy(face, r) {
    var idle = face.getAttribute('expression') || 'smile', baseAcc = face.getAttribute('accessory') || '';
    var ctx = document.createElement('canvas').getContext('2d'), mode = 'idle';
    function look(x, y, wait) { setTimeout(function () { if (face.lookAt) face.lookAt(x, y); }, wait || 0); }
    function setFace(ex, acc) {
      if (face.getAttribute('expression') !== ex) face.setAttribute('expression', ex);
      var a = [acc, baseAcc].filter(Boolean).join(' ');
      if ((face.getAttribute('accessory') || '') !== a) face.setAttribute('accessory', a);
    }
    function caret(inp) { // 글자 끝(커서) 위치를 화면 좌표로
      var cs = getComputedStyle(inp), rc = inp.getBoundingClientRect();
      ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      var pos = inp.selectionStart == null ? inp.value.length : inp.selectionStart;
      var txt = inp.type === 'password' ? new Array(pos + 1).join('•') : inp.value.slice(0, pos);
      var x = rc.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth) + ctx.measureText(txt).width - inp.scrollLeft;
      return [Math.max(rc.left, Math.min(rc.right - 8, x)), rc.top + rc.height / 2];
    }
    function watchId() { if (mode !== 'id') return; var p = caret(r.id); look(p[0], p[1]); }
    function onId() { mode = 'id'; setFace('watch', ''); look(0, 0, 0); requestAnimationFrame(watchId); setTimeout(watchId, 140); }
    function onPw() {
      if (r.password.type === 'text') { mode = 'peek'; setFace('idea', 'sunglasses-up'); var p = caret(r.password); look(p[0], p[1], 140); }
      else { mode = 'hide'; setFace('side', 'sunglasses'); var rc = face.getBoundingClientRect(); look(rc.left - 500, rc.top - 160, 140); }
    }
    function out() {
      setTimeout(function () {
        var a = document.activeElement;
        if (a === r.id || a === r.password || a === r.toggle) return;
        mode = 'idle'; setFace(idle, '');
        var rc = face.getBoundingClientRect(); look(rc.left + rc.width / 2, rc.top + rc.height * 2, 140);
      }, 30);
    }
    r.id.addEventListener('focus', onId);
    ['input', 'keyup', 'click', 'select'].forEach(function (t) { r.id.addEventListener(t, watchId); });
    r.password.addEventListener('focus', onPw);
    r.password.addEventListener('input', function () { if (mode === 'peek') { var p = caret(r.password); look(p[0], p[1]); } });
    [r.id, r.password, r.toggle].forEach(function (x) { if (x) x.addEventListener('blur', out); });
    if (r.toggle) r.toggle.addEventListener('click', function () {
      var show = r.password.type === 'password';
      r.password.type = show ? 'text' : 'password';
      r.toggle.setAttribute('aria-pressed', String(show));
      r.toggle.setAttribute('aria-label', show ? '비밀번호 숨기기' : '비밀번호 보기');
      if (r.toggle.classList.contains('qk-eye')) r.toggle.innerHTML = show ? EYE_OFF : EYE_ON;
      r.password.focus();
      onPw();
    });
    return {
      mood: function (ex) { setFace(ex, ''); },
      reset: function () { mode = 'idle'; setFace(idle, ''); }
    };
  }
  var loginSeq = 0;
  class QuokaLogin extends Base {
    connectedCallback() {
      ensureStyle();
      var self = this;
      if (!this._built) whenParsed(function () { if (self.isConnected && !self._built) self.init(); });
    }
    init() {
      this._built = true;
      var self = this, extra = Array.prototype.slice.call(this.childNodes), uid = 'qkl' + (++loginSeq);
      var act = this.getAttribute('action');
      this.className = 'qk';
      this.innerHTML = '';
      var form = el('form', 'qk-login'); form.noValidate = true;
      if (act) { form.action = act; form.method = this.getAttribute('method') || 'post'; }
      var fb = el('div', 'qk-login-face'), face = document.createElement('quoka-face');
      face.setAttribute('live', ''); face.setAttribute('follow', ''); face.setAttribute('sleep-after', '0'); face.setAttribute('poke', 'off');
      face.setAttribute('size', '116'); face.setAttribute('expression', 'smile'); face.setAttribute('label', '로그인을 지켜보는 쿼카');
      if (this.getAttribute('accessory')) face.setAttribute('accessory', this.getAttribute('accessory'));
      fb.appendChild(face); form.appendChild(fb);
      form.appendChild(el('h4', '', esc(this.getAttribute('heading') || '쿼카연구회 로그인')));
      var idF = el('div', 'qk-field', '<label for="' + uid + 'i">' + esc(this.getAttribute('id-label') || '아이디') + '</label>' +
        '<input id="' + uid + 'i" name="' + esc(this.getAttribute('id-name') || 'id') + '" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="' + esc(this.getAttribute('id-placeholder') || '아이디 또는 이메일') + '">');
      var pwF = el('div', 'qk-field', '<label for="' + uid + 'p">비밀번호</label><div class="qk-pw">' +
        '<input id="' + uid + 'p" type="password" name="password" autocomplete="current-password" placeholder="비밀번호">' +
        '<button type="button" class="qk-eye" aria-label="비밀번호 보기" aria-pressed="false">' + EYE_ON + '</button></div>');
      form.appendChild(idF); form.appendChild(pwF);
      var msg = el('p', 'qk-login-msg'); msg.setAttribute('role', 'status');
      var btn = el('button', 'qk-cta', esc(this.getAttribute('submit-label') || '로그인')); btn.type = 'submit';
      form.appendChild(msg); form.appendChild(btn);
      if (extra.some(function (n) { return n.nodeType === 1 || (n.textContent || '').trim(); })) {
        var foot = el('div', 'qk-login-foot'); extra.forEach(function (n) { foot.appendChild(n); }); form.appendChild(foot);
      }
      this.appendChild(form);
      var idIn = idF.querySelector('input'), pwIn = pwF.querySelector('input');
      this._face = face; this._msg = msg; this._btn = btn; this._form = form;
      this._buddy = loginBuddy(face, { id: idIn, password: pwIn, toggle: pwF.querySelector('.qk-eye') });
      form.addEventListener('submit', function (e) {
        var id = idIn.value.trim();
        if (!id || !pwIn.value) {
          e.preventDefault();
          (id ? pwIn : idIn).focus();
          self.fail(id ? '비밀번호를 적어 주세요.' : '아이디를 적어 주세요.');
          return;
        }
        if (!act) e.preventDefault();
        msg.className = 'qk-login-msg'; msg.textContent = '확인하고 있어요…';
        self.dispatchEvent(new CustomEvent('login', { detail: { id: id, form: form }, bubbles: true }));
      });
    }
    fail(m) {
      var self = this;
      this._msg.className = 'qk-login-msg err'; this._msg.textContent = m || '아이디나 비밀번호를 다시 확인해 주세요.';
      setTimeout(function () { self._buddy.mood('worried'); if (self._face.react) self._face.react('shake'); }, 60);
      this._form.classList.remove('shake'); void this._form.offsetWidth; this._form.classList.add('shake');
    }
    success(m) {
      var self = this;
      this._msg.className = 'qk-login-msg ok'; this._msg.textContent = m || '어서 오세요!';
      if (document.activeElement && this.contains(document.activeElement)) document.activeElement.blur();
      setTimeout(function () { self._buddy.mood('excited'); if (self._face.react) self._face.react('hop'); }, 80);
    }
    reset() {
      this._form.reset(); this._msg.textContent = ''; this._msg.className = 'qk-login-msg'; this._buddy.reset();
    }
  }

  // ── 쿼카 캘린더용 조각(1.5) ─────────────────────────────────────
  // 일정 종류 5가지. 색은 CSS 변수 --qk-c-event 등으로 바꾼다(어두운 화면은 한 단계 짙은 값으로).
  // 노랑·갈색은 화면이 누리끼리해 보여서 빼고, 공문은 차분한 회색(그 밖의 일)으로 둔다. 색만으로 구분하지 않게 늘 글자와 함께.
  var EV_TYPES = {
    event:    { label: '공개행사',    icon: 'notice',   c: '#D6517D' },
    training: { label: '연수·워크숍', icon: 'training', c: '#8A63D2' },
    meeting:  { label: '정기모임',    icon: 'members',  c: '#2E9E7C' },
    social:   { label: '친목·번개',   icon: 'coffee',   c: '#3F7FD9' },
    doc:      { label: '공문',        icon: 'document', c: '#7C8494' }
  };
  function evType(t) { return EV_TYPES[t] ? t : 'event'; }
  function evColor(t) { t = evType(t); return 'var(--qk-c-' + t + ',' + EV_TYPES[t].c + ')'; }
  function typeChip(t, label) {
    t = evType(t);
    return '<span class="qk-type" style="--c:' + evColor(t) + '"><i aria-hidden="true"></i>' + esc(label || EV_TYPES[t].label) + '</span>';
  }
  var SEASON = { 1: 'earmuffs', 2: 'mortarboard', 3: 'sprout', 4: 'blossom', 5: 'carnation', 6: 'rainhat', 7: 'bucket', 8: 'sunglasses', 9: 'pencil', 10: 'beret', 11: 'pom-beanie', 12: 'snowflake' };
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function parseDay(s) { if (!s) return null; if (s instanceof Date) return new Date(s.getFullYear(), s.getMonth(), s.getDate()); var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(s)); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function todayOf(el) { return parseDay(el.getAttribute('today')) || parseDay(root.QuokaKit && root.QuokaKit.today) || parseDay(new Date()); }
  function dayDiff(a, b) { return Math.round((a - b) / 86400000); }
  function md(d) { return (d.getMonth() + 1) + '.' + d.getDate() + '(' + WD[d.getDay()] + ')'; }
  function reduceMotion() { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function onVisible(node, fn) {
    if (!root.IntersectionObserver) return fn();
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { threshold: 0.3 });
    io.observe(node);
  }

  // ── 13. 탭 ─────────────────────────────────────────────────────
  // <quoka-tabs active="event"><button data-key="org">연구회</button>…</quoka-tabs> 또는 el.items = [{ key, label, count, icon }]
  // 넘치면 스크롤바 대신 양끝이 흐려지고 화살표가 생긴다. stretch = 칸을 고르게. 'change' 이벤트(detail.key). 화살표·Home·End 키.
  class QuokaTabs extends Base {
    constructor() { super(); this._items = null; }
    static get observedAttributes() { return ['active']; }
    get items() { return (this._items || []).slice(); }
    set items(v) { this._items = (v || []).map(function (x) { return { key: x.key, label: x.label || x.key, count: x.count, icon: x.icon }; }); if (this._ready) this.render(); }
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected) self.init(); }); }
    disconnectedCallback() { if (this._ro) this._ro.disconnect(); }
    attributeChangedCallback() { if (this._ready) this.updateActive(true); }
    init() {
      if (!this._items) {
        var j = this.getAttribute('items');
        if (j) { try { this.items = JSON.parse(j); } catch (e) { /* 무시 */ } }
        if (!this._items) this.items = Array.prototype.map.call(this.querySelectorAll('[data-key]'), function (b) {
          return { key: b.dataset.key, label: b.textContent.trim(), count: b.dataset.count, icon: b.dataset.icon };
        });
      }
      this._ready = true;
      this.render();
    }
    render() {
      var self = this;
      this.className = 'qk';
      this.innerHTML = '';
      var wrap = el('div', 'qk-tabs' + (this.hasAttribute('stretch') ? ' stretch' : ''));
      var track = el('div', 'qk-tabs-track');
      track.setAttribute('role', 'tablist'); track.setAttribute('aria-label', this.getAttribute('label') || '탭');
      this._items.forEach(function (x) {
        var b = el('button', 'qk-tab'); b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.key = x.key;
        b.innerHTML = (x.icon ? '<quoka-icon name="' + esc(x.icon) + '" size="20"></quoka-icon>' : '') + '<span>' + esc(x.label) + '</span>' +
          (x.count != null && x.count !== '' ? '<span class="n">' + esc(x.count) + '</span>' : '');
        b.addEventListener('click', function () { self.select(x.key); });
        track.appendChild(b);
      });
      track.addEventListener('keydown', function (e) {
        var keys = self._items.map(function (x) { return x.key; }), i = keys.indexOf(self.getAttribute('active')), n = -1;
        if (e.key === 'ArrowRight') n = Math.min(keys.length - 1, i + 1); else if (e.key === 'ArrowLeft') n = Math.max(0, i - 1);
        else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = keys.length - 1;
        if (n < 0) return;
        e.preventDefault(); self.select(keys[n]); track.children[n].focus();
      });
      var mk = function (cls, label, dir) {
        var a = el('button', 'qk-tabs-arrow ' + cls, dir < 0 ? '&#8249;' : '&#8250;'); a.type = 'button'; a.tabIndex = -1; a.setAttribute('aria-label', label);
        a.addEventListener('click', function () { track.scrollBy({ left: dir * track.clientWidth * 0.6, behavior: reduceMotion() ? 'auto' : 'smooth' }); });
        return a;
      };
      wrap.appendChild(mk('prev', '앞쪽 탭 보기', -1)); wrap.appendChild(track); wrap.appendChild(mk('next', '뒤쪽 탭 보기', 1));
      this.appendChild(wrap);
      this._track = track; this._wrap = wrap;
      var edges = function () {
        var l = track.scrollLeft > 2, r = track.scrollLeft + track.clientWidth < track.scrollWidth - 2;
        wrap.classList.toggle('l', l); wrap.classList.toggle('r', r);
      };
      track.addEventListener('scroll', edges, { passive: true });
      if (root.ResizeObserver) { if (this._ro) this._ro.disconnect(); this._ro = new ResizeObserver(edges); this._ro.observe(track); }
      this.updateActive(false);
      requestAnimationFrame(edges);
    }
    select(key) {
      if (key === this.getAttribute('active')) return;
      this.setAttribute('active', key);
      this.dispatchEvent(new CustomEvent('change', { detail: { key: key }, bubbles: true }));
    }
    updateActive(play) {
      var act = this.getAttribute('active') || (this._items[0] && this._items[0].key), track = this._track;
      Array.prototype.forEach.call(track.children, function (b) {
        var on = b.dataset.key === act;
        b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
        if (on) {
          var bl = b.offsetLeft, br = bl + b.offsetWidth;
          if (bl < track.scrollLeft + 24 || br > track.scrollLeft + track.clientWidth - 24) track.scrollTo({ left: bl - track.clientWidth / 2 + b.offsetWidth / 2, behavior: play && !reduceMotion() ? 'smooth' : 'auto' });
          var ic = b.querySelector('quoka-icon'); if (play && ic && ic.play) ic.play();
        }
      });
    }
  }

  // ── 14. 행사·연수 카드 ──────────────────────────────────────────
  // <quoka-event type="event" title="…" date="2026-11-21" apply-start="2026-11-04" apply-end="2026-11-06" count="11" capacity="25" confirmed="3">
  //   펼치면 보일 내용(신청자 표 등)
  // </quoka-event>
  // 날짜 칸 · 종류 칩 · 신청 상태와 마감 D-day · 정원 막대(확정 민트 + 대기 분홍) · 펼치기. 'toggle' 이벤트(detail.open). open 속성 = 펼친 채
  var evSeq = 0;
  class QuokaEvent extends Base {
    static get observedAttributes() { return ['title', 'date', 'type', 'count', 'capacity', 'confirmed', 'apply-start', 'apply-end', 'open', 'place', 'today', 'label', 'clickable']; }
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._ready) self.init(); }); }
    attributeChangedCallback(n) { if (!this._ready) return; if (n === 'open') this.syncOpen(); else this.render(); }
    init() {
      this._kids = Array.prototype.slice.call(this.childNodes);
      this._id = 'qkev' + (++evSeq);
      this._ready = true;
      this.render();
    }
    render() {
      var self = this, a = function (n) { return self.getAttribute(n); };
      var t = evType(a('type')), d = parseDay(a('date')), today = todayOf(this);
      var s = parseDay(a('apply-start')), e = parseDay(a('apply-end'));
      var count = parseInt(a('count'), 10) || 0, cap = parseInt(a('capacity'), 10) || 0, conf = Math.min(count, parseInt(a('confirmed'), 10) || 0);
      var past = d && dayDiff(d, today) < 0;
      var st = '', stc = '';
      if (past) { st = '지난 일정'; stc = 'done'; }
      else if (s && dayDiff(s, today) > 0) { st = '신청 ' + md(s) + ' 부터'; stc = 'soon'; }
      else if (e && dayDiff(e, today) >= 0) { var left = dayDiff(e, today); st = left === 0 ? '오늘 신청 마감' : '신청 중 · 마감 D-' + left; stc = 'open'; }
      else if (e) { st = '신청 마감'; stc = 'closed'; }
      var dd = d ? dayDiff(d, today) : null;
      this.className = 'qk';
      var body = this._body || el('div', 'qk-ev-body');
      this.innerHTML = '';
      var card = el('div', 'qk-ev' + (past ? ' past' : ''));
      card.style.setProperty('--c', evColor(t));
      var hasBody = (this._body ? Array.prototype.slice.call(this._body.childNodes) : this._kids).some(function (n) { return n.nodeType === 1 || (n.textContent || '').trim(); });
      var link = !hasBody && this.hasAttribute('clickable'); // clickable: 펼치는 대신 'open' 이벤트(자세히 보기 창 열기용)
      var head = el(hasBody || link ? 'button' : 'div', 'qk-ev-head' + (hasBody ? '' : ' still') + (link ? ' link' : ''));
      if (hasBody) { head.type = 'button'; head.setAttribute('aria-controls', this._id); head.setAttribute('aria-expanded', String(this.hasAttribute('open'))); }
      else if (link) { head.type = 'button'; head.addEventListener('click', function () { self.dispatchEvent(new CustomEvent('open', { bubbles: true })); }); }
      else head.setAttribute('role', 'group');
      head.innerHTML =
        '<span class="qk-ev-date"' + (d ? '' : ' hidden') + '><small>' + (d ? (d.getMonth() + 1) + '월' : '') + '</small><b>' + (d ? d.getDate() : '') + '</b><small>' + (d ? WD[d.getDay()] : '') + '</small></span>' +
        '<span class="qk-ev-main"><span class="qk-ev-chips">' + typeChip(t, a('label')) +
          (st ? '<span class="qk-ev-st ' + stc + '">' + esc(st) + '</span>' : '') +
          (dd != null && dd >= 0 && dd <= 30 ? '<span class="qk-ev-dd">' + (dd === 0 ? '오늘이에요' : '일정 D-' + dd) + '</span>' : '') + '</span>' +
          '<b class="qk-ev-title">' + esc(a('title') || '') + '</b>' +
          '<span class="qk-ev-meta">' + (s && e ? '신청 ' + md(s) + ' ~ ' + md(e) : '') + (a('place') ? (s && e ? ' · ' : '') + esc(a('place')) : '') + '</span></span>' +
        '<span class="qk-ev-side">' +
          '<span class="qk-ev-num"><b>' + count + '</b>' + (cap ? '<small>/' + cap + '명</small>' : '<small>명</small>') + '</span>' +
          (cap || conf ? '<span class="qk-ev-bar" aria-hidden="true"><i class="cf" style="width:' + (cap ? Math.min(100, conf / cap * 100) : (count ? conf / count * 100 : 0)).toFixed(1) + '%"></i><i class="wt" style="width:' + (cap ? Math.min(100, (count - conf) / cap * 100) : (count ? (count - conf) / count * 100 : 0)).toFixed(1) + '%"></i></span>' : '') +
          (conf ? '<small class="qk-ev-conf">확정 ' + conf + (count - conf ? ' · 대기 ' + (count - conf) : '') + '</small>' : '') +
        '</span>' +
        '<span class="qk-ev-chev" aria-hidden="true"></span>';
      head.setAttribute('aria-label', (a('title') || '') + ', ' + EV_TYPES[t].label + (d ? ', ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일' : '') + (st ? ', ' + st : '') + ', 신청 ' + count + '명' + (cap ? ' / 정원 ' + cap + '명' : '') + (conf ? ', 확정 ' + conf + '명' : ''));
      if (hasBody) head.addEventListener('click', function () { if (self.hasAttribute('open')) self.removeAttribute('open'); else self.setAttribute('open', ''); self.dispatchEvent(new CustomEvent('toggle', { detail: { open: self.hasAttribute('open') }, bubbles: true })); });
      card.appendChild(head);
      body.id = this._id;
      if (!this._body) { this._kids.forEach(function (k) { body.appendChild(k); }); this._body = body; }
      card.appendChild(body);
      this.appendChild(card);
      this.syncOpen();
    }
    syncOpen() {
      var open = this.hasAttribute('open'), hasBody = this._body && this._body.childNodes.length && Array.prototype.some.call(this._body.childNodes, function (n) { return n.nodeType === 1 || (n.textContent || '').trim(); });
      this._body.hidden = !open || !hasBody;
      var h = this.querySelector('.qk-ev-head'); if (h) h.setAttribute('aria-expanded', String(open));
      var c = this.querySelector('.qk-ev'); if (c) c.classList.toggle('open', open);
    }
  }

  // ── 15. 월 달력 ─────────────────────────────────────────────────
  // <quoka-calendar month="2026-11"></quoka-calendar> · el.events = [{ date: '2026-11-07', end, title, type, time, place }]
  // 머리에 그달 계절 아이템을 쓴 쿼카. 날짜를 누르면 아래에 그날 일정. 좁으면 일정 이름 대신 점으로.
  // 이벤트: select(detail.date, detail.events) · month(detail.month). today="2026-11-05"로 오늘을 정할 수 있다.
  class QuokaCalendar extends Base {
    constructor() { super(); this._events = []; }
    static get observedAttributes() { return ['month', 'today', 'mascot']; }
    get events() { return this._events.slice(); }
    set events(v) { this._events = (v || []).filter(function (x) { return parseDay(x.date); }); if (this._ready) this.render(); }
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._ready) { self._ready = true; self.render(); } }); }
    disconnectedCallback() { if (this._ro) this._ro.disconnect(); }
    attributeChangedCallback() { if (this._ready) this.render(); }
    monthDate() { var m = /^(\d{4})-(\d{1,2})/.exec(this.getAttribute('month') || ''); var t = todayOf(this); return m ? new Date(+m[1], +m[2] - 1, 1) : new Date(t.getFullYear(), t.getMonth(), 1); }
    on(day) {
      var k = ymd(day);
      return this._events.filter(function (x) { var s = ymd(parseDay(x.date)), e = x.end ? ymd(parseDay(x.end)) : s; return k >= s && k <= e; });
    }
    go(delta) {
      var m = this.monthDate(); m.setMonth(m.getMonth() + delta);
      var key = m.getFullYear() + '-' + ('0' + (m.getMonth() + 1)).slice(-2);
      this._sel = null;
      this.setAttribute('month', key);
      this.dispatchEvent(new CustomEvent('month', { detail: { month: key }, bubbles: true }));
    }
    render() {
      var self = this, m = this.monthDate(), today = todayOf(this), Y = m.getFullYear(), M = m.getMonth();
      var start = new Date(Y, M, 1 - m.getDay()), weeks = Math.ceil((m.getDay() + new Date(Y, M + 1, 0).getDate()) / 7);
      if (!this._sel || this._sel.getMonth() !== M) this._sel = (today.getFullYear() === Y && today.getMonth() === M) ? today : new Date(Y, M, 1);
      var inMonth = this._events.filter(function (x) { var d = parseDay(x.date), e = parseDay(x.end) || d; return (d.getFullYear() === Y && d.getMonth() === M) || (e.getFullYear() === Y && e.getMonth() === M); });
      this.className = 'qk';
      this.innerHTML = '';
      var box = el('div', 'qk-cal');
      var head = el('div', 'qk-cal-head');
      if (this.hasAttribute('mascot')) head.appendChild(faceImg({ expression: 'smile', accessory: this.getAttribute('mascot') || SEASON[M + 1], motion: 'idle' }, 52, ''));
      head.appendChild(el('div', 'qk-cal-title', '<b>' + Y + '년 ' + (M + 1) + '월</b><small>일정 ' + inMonth.length + '개</small>'));
      var nav = el('div', 'qk-cal-nav');
      [['&#8249;', '지난달', -1], ['오늘', '이번 달로', 0], ['&#8250;', '다음 달', 1]].forEach(function (b) {
        var x = el('button', 'qk-cal-btn' + (b[2] === 0 ? ' txt' : ''), b[0]); x.type = 'button'; x.setAttribute('aria-label', b[1]);
        x.addEventListener('click', function () {
          if (b[2]) return self.go(b[2]);
          self._sel = today; self.setAttribute('month', today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2));
          self.render();
        });
        nav.appendChild(x);
      });
      head.appendChild(nav);
      box.appendChild(head);
      var used = {}; inMonth.forEach(function (x) { used[evType(x.type)] = 1; });
      var legend = el('div', 'qk-cal-legend');
      Object.keys(EV_TYPES).forEach(function (k) { if (used[k]) legend.insertAdjacentHTML('beforeend', '<span><i style="background:' + evColor(k) + '"></i>' + EV_TYPES[k].label + '</span>'); });
      if (legend.children.length) box.appendChild(legend);
      var grid = el('div', 'qk-cal-grid'); grid.setAttribute('role', 'grid'); grid.setAttribute('aria-label', Y + '년 ' + (M + 1) + '월');
      var hr = el('div', 'qk-cal-row wd'); hr.setAttribute('role', 'row');
      WD.forEach(function (w, i) { var c = el('span', i === 0 ? 'sun' : (i === 6 ? 'sat' : ''), w); c.setAttribute('role', 'columnheader'); hr.appendChild(c); });
      grid.appendChild(hr);
      for (var w = 0; w < weeks; w++) {
        var row = el('div', 'qk-cal-row'); row.setAttribute('role', 'row');
        for (var i = 0; i < 7; i++) {
          var day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + i), evs = this.on(day);
          var out = day.getMonth() !== M, isT = ymd(day) === ymd(today), isS = ymd(day) === ymd(this._sel);
          var c = el('button', 'qk-cal-day' + (out ? ' out' : '') + (isT ? ' today' : '') + (isS ? ' sel' : '') + (i === 0 ? ' sun' : (i === 6 ? ' sat' : '')));
          c.type = 'button'; c.setAttribute('role', 'gridcell'); c.tabIndex = isS ? 0 : -1;
          c.setAttribute('aria-label', (day.getMonth() + 1) + '월 ' + day.getDate() + '일 ' + WD[day.getDay()] + '요일' + (isT ? ', 오늘' : '') + (evs.length ? ', 일정 ' + evs.length + '개' : ''));
          c.setAttribute('aria-selected', String(isS));
          var html = '<span class="num">' + day.getDate() + '</span><span class="evs">';
          evs.slice(0, 2).forEach(function (x) { html += '<span class="ev" style="--c:' + evColor(x.type) + '">' + esc(x.title) + '</span>'; });
          if (evs.length > 2) html += '<span class="more">+' + (evs.length - 2) + '</span>';
          html += '</span><span class="dots">';
          evs.slice(0, 3).forEach(function (x) { html += '<i style="background:' + evColor(x.type) + '"></i>'; });
          c.innerHTML = html + '</span>';
          (function (d0) { c.addEventListener('click', function () { self.pick(d0); }); })(day);
          row.appendChild(c);
        }
        grid.appendChild(row);
      }
      grid.addEventListener('keydown', function (e) {
        var mv = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (!mv) return;
        e.preventDefault();
        var n = new Date(self._sel.getFullYear(), self._sel.getMonth(), self._sel.getDate() + mv);
        self.pick(n, true);
      });
      box.appendChild(grid);
      var ag = el('div', 'qk-cal-agenda'); ag.setAttribute('aria-live', 'polite');
      box.appendChild(ag);
      this.appendChild(box);
      this._grid = grid; this._agenda = ag; this._box = box;
      var fit = function () { box.classList.toggle('compact', box.clientWidth < 600); };
      if (root.ResizeObserver) { if (this._ro) this._ro.disconnect(); this._ro = new ResizeObserver(fit); this._ro.observe(box); }
      fit();
      this.renderAgenda();
    }
    pick(day, focus) {
      this._sel = day;
      var m = this.monthDate();
      if (day.getMonth() !== m.getMonth() || day.getFullYear() !== m.getFullYear()) this.setAttribute('month', day.getFullYear() + '-' + ('0' + (day.getMonth() + 1)).slice(-2));
      this._sel = day;
      this.render();
      if (focus) { var s = this.querySelector('.qk-cal-day.sel'); if (s) s.focus(); }
      this.dispatchEvent(new CustomEvent('select', { detail: { date: ymd(day), events: this.on(day) }, bubbles: true }));
    }
    renderAgenda() {
      var d = this._sel, evs = this.on(d), ag = this._agenda;
      ag.innerHTML = '<p class="qk-cal-day-h"><b>' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + WD[d.getDay()] + '요일</b>' + (ymd(d) === ymd(todayOf(this)) ? '<span>오늘</span>' : '') + '</p>';
      if (!evs.length) {
        var em = el('div', 'qk-cal-empty');
        em.appendChild(faceImg({ expression: 'calm', accessory: SEASON[d.getMonth() + 1] }, 40, ''));
        em.appendChild(el('span', '', '이날은 비어 있어요. 쉬어 가는 날!'));
        ag.appendChild(em);
        return;
      }
      var ul = el('ul', 'qk-cal-list');
      var self = this;
      evs.forEach(function (x) { // 누르면 'open' 이벤트(detail.event) — 자세히 보기 창을 열 때
        var li = el('li', '', '<button type="button" class="qk-cal-item">' + typeChip(x.type) + '<b>' + esc(x.title) + '</b><small>' + esc([x.time, x.place].filter(Boolean).join(' · ')) + '</small></button>');
        li.style.setProperty('--c', evColor(x.type));
        li.firstChild.addEventListener('click', function () { self.dispatchEvent(new CustomEvent('open', { detail: { event: x }, bubbles: true })); });
        ul.appendChild(li);
      });
      ag.appendChild(ul);
    }
  }

  // ── 16. 숫자 칸 ─────────────────────────────────────────────────
  // <quoka-stat label="참여 연인원" value="230" unit="명" icon="members" delta="+12" hint="지난달보다" highlight>
  // 화면에 보이면 0부터 세어 올라간다(동작 줄이기면 바로). 소수 자리는 value를 따른다.
  class QuokaStat extends Base {
    static get observedAttributes() { return ['label', 'value', 'unit', 'icon', 'delta', 'hint', 'highlight']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(true); }
    render(again) {
      var a = this.getAttribute.bind(this), v = a('value') || '0', num = parseFloat(String(v).replace(/,/g, '')), dec = (String(v).split('.')[1] || '').length;
      var delta = a('delta'), up = delta && !/^-/.test(delta);
      this.className = 'qk';
      this.innerHTML = '';
      var box = el('div', 'qk-stat' + (this.hasAttribute('highlight') ? ' hl' : ''));
      box.innerHTML = (a('icon') ? '<quoka-icon name="' + esc(a('icon')) + '" size="30"></quoka-icon>' : '') +
        '<span class="v"><b>' + esc(v) + '</b>' + (a('unit') ? '<small>' + esc(a('unit')) + '</small>' : '') + '</span>' +
        '<span class="l">' + esc(a('label') || '') + '</span>' +
        (delta ? '<span class="d ' + (up ? 'up' : 'down') + '"><i aria-hidden="true">' + (up ? '▲' : '▼') + '</i>' + esc(delta.replace(/^[+-]/, '')) + (a('hint') ? '<small>' + esc(a('hint')) + '</small>' : '') + '</span>' : (a('hint') ? '<span class="d"><small>' + esc(a('hint')) + '</small></span>' : ''));
      this.appendChild(box);
      var b = box.querySelector('.v b');
      if (isNaN(num) || reduceMotion() || again) return;
      var fmt = function (x) { return x.toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
      b.textContent = fmt(0);
      onVisible(box, function () {
        var t0 = performance.now();
        (function tick(t) {
          var p = Math.min(1, (t - t0) / 900), k = 1 - Math.pow(1 - p, 3);
          b.textContent = fmt(num * k);
          if (p < 1) requestAnimationFrame(tick); else b.textContent = esc(v);
        })(t0);
      });
    }
  }

  // ── 17. 월별 막대 ───────────────────────────────────────────────
  // <quoka-bars label="월별 참여 연인원" unit="명" highlight="11월"></quoka-bars> · el.data = [{ label: '11월', value: 24, note: '일정 4건' }]
  // 막대 하나 = 한 달, 한 가지 숫자만(두 숫자는 막대를 따로). 올리거나 누르면 값과 메모. 화면 읽기용 표가 함께 들어 있다.
  class QuokaBars extends Base {
    constructor() { super(); this._data = []; }
    static get observedAttributes() { return ['label', 'unit', 'highlight']; }
    get data() { return this._data.slice(); }
    set data(v) { this._data = (v || []).map(function (x) { return { label: String(x.label), value: +x.value || 0, note: x.note || '' }; }); if (this.isConnected) this.render(); }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this, data = this._data, unit = this.getAttribute('unit') || '', hl = this.getAttribute('highlight');
      var max = Math.max.apply(null, data.map(function (x) { return x.value; }).concat([1]));
      var step = Math.pow(10, Math.floor(Math.log10(max))), nice = Math.ceil(max / step) * step; if (nice / step <= 2) step = step / 2; nice = Math.ceil(max / step) * step;
      var peak = data.reduce(function (b, x, i) { return x.value > data[b].value ? i : b; }, 0);
      this.className = 'qk';
      this.innerHTML = '';
      var box = el('figure', 'qk-bars');
      if (this.getAttribute('label')) box.appendChild(el('figcaption', '', esc(this.getAttribute('label'))));
      var plot = el('div', 'qk-bars-plot');
      plot.setAttribute('role', 'img');
      plot.setAttribute('aria-label', (this.getAttribute('label') || '막대 그래프') + '. ' + data.map(function (x) { return x.label + ' ' + x.value + unit; }).join(', '));
      var grid = el('div', 'qk-bars-grid', [nice, nice / 2, 0].map(function (v) { return '<span><em>' + v + '</em></span>'; }).join(''));
      grid.setAttribute('aria-hidden', 'true');
      plot.appendChild(grid);
      var cols = el('div', 'qk-bars-cols'); cols.setAttribute('aria-hidden', 'true');
      var tip = el('div', 'qk-bars-tip'); tip.hidden = true;
      data.forEach(function (x, i) {
        var c = el('div', 'qk-bar' + (x.label === hl ? ' hl' : ''));
        var showLabel = i === peak || x.label === hl;
        c.innerHTML = '<span class="b" style="height:' + (x.value / nice * 100).toFixed(2) + '%">' + (showLabel ? '<em>' + x.value + '</em>' : '') + '</span><small>' + esc(x.label) + '</small>';
        c.style.setProperty('--i', i);
        var show = function () {
          tip.innerHTML = '<b>' + esc(x.label) + '</b> ' + x.value + unit + (x.note ? '<small>' + esc(x.note) + '</small>' : '');
          tip.hidden = false;
          var r = c.getBoundingClientRect(), pr = plot.getBoundingClientRect();
          tip.style.left = Math.max(0, Math.min(pr.width - tip.offsetWidth, r.left - pr.left + r.width / 2 - tip.offsetWidth / 2)) + 'px';
        };
        c.addEventListener('pointerenter', show); c.addEventListener('click', show);
        c.addEventListener('pointerleave', function () { tip.hidden = true; });
        cols.appendChild(c);
      });
      plot.appendChild(cols); plot.appendChild(tip);
      box.appendChild(plot);
      var tb = '<table class="qk-sr"><caption>' + esc(this.getAttribute('label') || '') + '</caption><tr><th>달</th><th>값</th><th>메모</th></tr>' +
        data.map(function (x) { return '<tr><td>' + esc(x.label) + '</td><td>' + x.value + unit + '</td><td>' + esc(x.note) + '</td></tr>'; }).join('') + '</table>';
      box.insertAdjacentHTML('beforeend', tb);
      this.appendChild(box);
      if (!reduceMotion()) { box.classList.add('pre'); onVisible(box, function () { requestAnimationFrame(function () { box.classList.remove('pre'); }); }); }
    }
  }

  // ── 쿼카 홈페이지 조각(1.6) ─────────────────────────────────────
  function relDay(s, today) { // '오늘' · '어제' · '3일 전' · '11.4'
    var d = parseDay(s); if (!d) return '';
    var n = dayDiff(today, d);
    if (n === 0) return '오늘'; if (n === 1) return '어제'; if (n > 1 && n < 7) return n + '일 전';
    return (d.getMonth() + 1) + '.' + d.getDate();
  }
  var HEART = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 20.5c-.9-.7-8-5.3-8-10.4A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 8 2.7c0 5.1-7.1 9.7-8 10.4Z" fill="currentColor"/></svg>';
  var BUBBLE = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4.5 3.5V17H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  // ── 18. 토스트 ─────────────────────────────────────────────────
  // QuokaKit.toast('저장했어요', { mood: 'happy', time: 2400, action: { label: '되돌리기', onClick } })
  // 화면 아래 가운데에 쿼카 얼굴과 함께 잠깐 떴다 사라진다. 화면 읽기 프로그램에도 읽힌다. 셋까지 쌓인다.
  var TOAST_FACE = { happy: 'happy', ok: 'happy', smile: 'smile', worried: 'worried', error: 'worried', sad: 'sad', idea: 'idea', calm: 'calm', excited: 'excited' };
  function toast(msg, o) {
    o = o || {};
    ensureStyle();
    var box = document.querySelector('.qk-toasts');
    if (!box) { box = el('div', 'qk qk-toasts'); box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    var t = el('div', 'qk-toast' + (o.mood === 'error' || o.mood === 'worried' ? ' bad' : ''));
    t.appendChild(faceImg({ expression: TOAST_FACE[o.mood] || 'smile' }, 28, ''));
    t.appendChild(el('span', '', esc(msg)));
    var bye = function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, reduceMotion() ? 0 : 220); };
    if (o.action) {
      var b = el('button', '', esc(o.action.label)); b.type = 'button';
      b.addEventListener('click', function () { if (o.action.onClick) o.action.onClick(); bye(); });
      t.appendChild(b);
    }
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(bye, o.time || (o.action ? 5000 : 2600));
    return { close: bye };
  }

  // ── 19. 창(시트) ───────────────────────────────────────────────
  // <quoka-sheet heading="일정 한 장" mascot="smile">안쪽 내용</quoka-sheet> · el.show() · el.close()
  // 넓은 화면에선 오른쪽에서, 휴대폰에선 아래에서 올라온다. Esc · 바깥 누르기 · 닫기 단추로 닫힌다(브라우저 dialog 사용). 이벤트: close
  class QuokaSheet extends Base {
    static get observedAttributes() { return ['heading', 'open']; }
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._d) self.init(); }); }
    attributeChangedCallback(n) {
      if (!this._d) return;
      if (n === 'heading') this._h.textContent = this.getAttribute('heading') || '';
      if (n === 'open') { if (this.hasAttribute('open') && !this._d.open) this._show(); else if (!this.hasAttribute('open') && this._d.open) this._d.close(); }
    }
    init() {
      var self = this, kids = Array.prototype.slice.call(this.childNodes);
      this.className = 'qk';
      var d = el('dialog', 'qk-sheet'); d.setAttribute('aria-labelledby', (this._hid = 'qksh' + (++evSeq)));
      var head = el('div', 'qk-sheet-head');
      if (this.getAttribute('mascot') != null) head.appendChild(faceImg({ expression: this.getAttribute('mascot') || 'smile' }, 44, ''));
      this._h = el('h3', '', esc(this.getAttribute('heading') || '')); this._h.id = this._hid;
      head.appendChild(this._h);
      var x = el('button', 'qk-sheet-x', '&times;'); x.type = 'button'; x.setAttribute('aria-label', '닫기');
      x.addEventListener('click', function () { self.close(); });
      head.appendChild(x);
      var body = el('div', 'qk-sheet-body'); kids.forEach(function (k) { body.appendChild(k); });
      d.appendChild(head); d.appendChild(body);
      d.addEventListener('click', function (e) { if (e.target === d) self.close(); });
      d.addEventListener('close', function () { self.removeAttribute('open'); self.dispatchEvent(new CustomEvent('close', { bubbles: true })); });
      this.appendChild(d); this._d = d;
      if (this.hasAttribute('open')) this._show();
    }
    _show() { if (this._d.showModal) this._d.showModal(); else this._d.setAttribute('open', ''); }
    show() { if (!this._d) return this.setAttribute('open', ''); this.setAttribute('open', ''); }
    close() { if (this._d && this._d.open) this._d.close(); this.removeAttribute('open'); }
  }

  // ── 20. 게시글 줄 ──────────────────────────────────────────────
  // <quoka-post title="…" author="햇살쌤" category="수업 나눔" date="2026-11-04" comments="5" likes="12" href="/board/12" pinned new liked>
  // 글쓴이 쿼카 · 갈래 · 고정 · 새 글 점 · 댓글 · 공감(누르면 'like' 이벤트, detail.liked)
  class QuokaPost extends Base {
    static get observedAttributes() { return ['title', 'author', 'category', 'date', 'comments', 'likes', 'href', 'pinned', 'new', 'liked', 'excerpt', 'today']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this, a = function (n) { return self.getAttribute(n); }, liked = this.hasAttribute('liked');
      var likes = parseInt(a('likes'), 10) || 0;
      this.className = 'qk';
      this.innerHTML = '';
      var row = el('div', 'qk-post' + (this.hasAttribute('pinned') ? ' pinned' : ''));
      var av = document.createElement('quoka-avatar'); av.setAttribute('seed', a('author') || '쿼카'); av.setAttribute('size', '40');
      row.appendChild(av);
      var main = el(a('href') ? 'a' : 'div', 'qk-post-main');
      if (a('href')) main.href = a('href');
      main.innerHTML = '<span class="qk-post-top">' + (this.hasAttribute('pinned') ? '<span class="pin">공지</span>' : '') + (a('category') ? '<span class="cat">' + esc(a('category')) + '</span>' : '') + '</span>' +
        '<b>' + esc(a('title') || '') + (this.hasAttribute('new') ? '<i class="new" aria-label="새 글"></i>' : '') + '</b>' +
        (a('excerpt') ? '<span class="ex">' + esc(a('excerpt')) + '</span>' : '') +
        '<small>' + esc(a('author') || '') + ' · ' + relDay(a('date'), todayOf(this)) + '</small>';
      row.appendChild(main);
      var side = el('div', 'qk-post-side');
      side.appendChild(el('span', 'cm', BUBBLE + '<span>' + (parseInt(a('comments'), 10) || 0) + '</span>'));
      var lb = el('button', 'lk' + (liked ? ' on' : ''), HEART + '<span>' + likes + '</span>'); lb.type = 'button';
      lb.setAttribute('aria-pressed', String(liked)); lb.setAttribute('aria-label', '공감 ' + likes + '개' + (liked ? ', 공감함' : ''));
      lb.addEventListener('click', function () {
        var on = !self.hasAttribute('liked');
        self.setAttribute('likes', String(likes + (on ? 1 : -1)));
        if (on) self.setAttribute('liked', ''); else self.removeAttribute('liked');
        self.dispatchEvent(new CustomEvent('like', { detail: { liked: on }, bubbles: true }));
      });
      side.appendChild(lb);
      row.appendChild(side);
      this.appendChild(row);
    }
  }

  // ── 21. 자료 줄 ────────────────────────────────────────────────
  // <quoka-file name="6학년 AI 윤리 수업안.hwp" type="hwp" size="1.2MB" by="햇살쌤" date="2026-10-24" downloads="23" href="…" tags="AI융합, 6학년">
  // type: hwp · pdf · ppt · xls · doc · img · video · link · zip (없으면 이름 끝에서 알아낸다). 받기 단추를 누르면 'download' 이벤트
  var FILE_T = { hwp: ['HWP', '#3F7FD9'], pdf: ['PDF', '#D6517D'], ppt: ['PPT', '#8A63D2'], xls: ['XLS', '#2E9E7C'], doc: ['DOC', '#3F7FD9'],
    img: ['IMG', '#7A6FA8'], video: ['영상', '#B04F8A'], link: ['링크', '#7C8494'], zip: ['ZIP', '#6E6A64'] };
  function fileType(t, name) {
    if (FILE_T[t]) return t;
    var ext = (/\.([a-z0-9]+)$/i.exec(name || '') || [])[1] || '';
    ext = ext.toLowerCase();
    return { hwpx: 'hwp', hwp: 'hwp', pdf: 'pdf', ppt: 'ppt', pptx: 'ppt', key: 'ppt', xls: 'xls', xlsx: 'xls', csv: 'xls', doc: 'doc', docx: 'doc',
      png: 'img', jpg: 'img', jpeg: 'img', gif: 'img', webp: 'img', mp4: 'video', mov: 'video', zip: 'zip' }[ext] || (/^https?:/.test(name || '') ? 'link' : 'link');
  }
  class QuokaFile extends Base {
    static get observedAttributes() { return ['name', 'type', 'size', 'by', 'date', 'downloads', 'href', 'tags', 'today']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this, a = function (n) { return self.getAttribute(n); };
      var t = fileType(a('type'), a('name')), ft = FILE_T[t], link = t === 'link';
      this.className = 'qk';
      this.innerHTML = '';
      var row = el('div', 'qk-file');
      row.appendChild(el('span', 'qk-file-t', '<span style="background:var(--qk-f-' + t + ',' + ft[1] + ')">' + ft[0] + '</span>'));
      var meta = [a('by'), relDay(a('date'), todayOf(this)), a('size'), a('downloads') ? '받기 ' + a('downloads') : ''].filter(Boolean).map(esc).join(' · ');
      var tags = (a('tags') || '').split(/\s*,\s*/).filter(Boolean);
      row.appendChild(el('div', 'qk-file-main', '<b>' + esc(a('name') || '') + '</b><small>' + meta + '</small>' +
        (tags.length ? '<span class="tags">' + tags.map(function (x) { return '<i>#' + esc(x) + '</i>'; }).join('') + '</span>' : '')));
      var b = el(a('href') ? 'a' : 'button', 'qk-file-get', '<quoka-icon name="' + (link ? 'link' : 'download') + '" size="22"></quoka-icon><span>' + (link ? '열기' : '받기') + '</span>');
      if (a('href')) { b.href = a('href'); if (!link) b.setAttribute('download', ''); else { b.target = '_blank'; b.rel = 'noopener'; } } else b.type = 'button';
      b.setAttribute('aria-label', (a('name') || '자료') + (link ? ' 열기' : ' 받기'));
      b.addEventListener('click', function () { self.dispatchEvent(new CustomEvent('download', { detail: { name: a('name'), type: t }, bubbles: true })); });
      row.appendChild(b);
      this.appendChild(row);
    }
  }

  // ── 22. 멤버 카드 ──────────────────────────────────────────────
  // <quoka-member name="햇살쌤" group="ai-sel" role="분과장" region="평택" tags="사회정서, 그림책" bio="…" contact="010-1234-5678" reveal>
  // 연락처는 가운데를 가려 보여 주고, reveal(운영진)일 때만 「보기」로 펼친다. 아니면 '운영진만 볼 수 있어요'
  function maskPhone(p) { return String(p || '').replace(/(\d{2,3})[-\s]?(\d{3,4})[-\s]?(\d{4})/, '$1-••••-$3'); }
  class QuokaMember extends Base {
    static get observedAttributes() { return ['name', 'group', 'role', 'region', 'tags', 'bio', 'contact', 'reveal']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this, a = function (n) { return self.getAttribute(n); }, g = findGroup(a('group') || '');
      this.className = 'qk';
      this.innerHTML = '';
      var c = el('div', 'qk-member');
      var av = document.createElement('quoka-avatar'); av.setAttribute('seed', a('name') || '쿼카'); av.setAttribute('size', '56');
      c.appendChild(av);
      var tags = (a('tags') || '').split(/\s*,\s*/).filter(Boolean);
      var info = el('div', 'qk-member-main',
        '<b>' + esc(a('name') || '') + (a('role') ? '<span class="role">' + esc(a('role')) + '</span>' : '') + '</b>' +
        '<span class="grp">' + (g ? '<quoka-icon name="' + g.key + '" size="20"></quoka-icon>' + esc(g.name) : '') + (a('region') ? (g ? ' · ' : '') + esc(a('region')) : '') + '</span>' +
        (a('bio') ? '<p>' + esc(a('bio')) + '</p>' : '') +
        (tags.length ? '<span class="tags">' + tags.map(function (x) { return '<i>' + esc(x) + '</i>'; }).join('') + '</span>' : ''));
      c.appendChild(info);
      if (a('contact')) {
        var ct = el('div', 'qk-member-ct');
        if (this.hasAttribute('reveal')) {
          var shown = false, num = el('span', 'num', esc(maskPhone(a('contact'))));
          var b = el('button', '', '보기'); b.type = 'button';
          b.addEventListener('click', function () { shown = !shown; num.textContent = shown ? a('contact') : maskPhone(a('contact')); b.textContent = shown ? '가리기' : '보기'; });
          ct.appendChild(num); ct.appendChild(b);
        } else ct.appendChild(el('span', 'lock', '<quoka-icon name="lock" size="18"></quoka-icon>연락처는 운영진만 볼 수 있어요'));
        c.appendChild(ct);
      }
      this.appendChild(c);
    }
  }

  // ── 23. 투표 ───────────────────────────────────────────────────
  // <quoka-poll question="12월 정기모임 날짜" options='["12/10 수","12/11 목"]' votes='[5,9]' multiple closed>
  // 고르고 「투표하기」를 누르면 막대와 작은 쿼카 무리로 결과가 나온다. 'vote' 이벤트(detail.choices). 다시 고를 수 있다.
  class QuokaPoll extends Base {
    constructor() { super(); this._mine = null; }
    static get observedAttributes() { return ['question', 'options', 'votes', 'closed']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    j(n, d) { try { return JSON.parse(this.getAttribute(n)) || d; } catch (e) { return d; } }
    render() {
      var self = this, opts = this.j('options', []), votes = this.j('votes', []), multi = this.hasAttribute('multiple'), closed = this.hasAttribute('closed');
      var show = closed || this._mine;
      var total = opts.reduce(function (s, _, i) { return s + (votes[i] || 0); }, 0), max = Math.max.apply(null, votes.concat([0]));
      this.className = 'qk';
      this.innerHTML = '';
      var box = el('div', 'qk-poll');
      var id = 'qkp' + (++evSeq);
      box.appendChild(el('h4', '', esc(this.getAttribute('question') || '')));
      box.appendChild(el('p', 'qk-poll-sub', closed ? '마감된 투표예요 · ' + total + '명 참여' : (show ? total + '명 참여 · 다시 고를 수 있어요' : (multi ? '여러 개 고를 수 있어요' : '하나를 골라 주세요'))));
      var list = el('div', 'qk-poll-list'); list.setAttribute('role', 'group'); list.setAttribute('aria-labelledby', id);
      box.firstChild.id = id;
      var pick = (this._mine || []).slice();
      opts.forEach(function (o, i) {
        var v = votes[i] || 0, pct = total ? Math.round(v / total * 100) : 0, mine = (self._mine || []).indexOf(i) >= 0;
        var b = el('button', 'qk-poll-opt' + (show ? ' res' : '') + (mine ? ' mine' : '') + (show && v === max && v > 0 ? ' top' : ''));
        b.type = 'button'; b.disabled = closed;
        b.setAttribute('aria-pressed', String(mine));
        b.innerHTML = (show ? '<span class="fill" style="width:' + pct + '%"></span>' : '') + '<span class="mk" aria-hidden="true"></span><span class="t">' + esc(o) + '</span>' +
          (show ? '<span class="faces">' + new Array(Math.min(v, 5) + 1).join('<img alt="" src="' + Q.url({ expression: mine ? 'happy' : 'smile' }) + '">') + '</span><span class="p">' + pct + '%</span>' : '');
        b.addEventListener('click', function () {
          if (show && !closed) { self._mine = null; self.render(); return; }
          var k = pick.indexOf(i);
          if (multi) { if (k >= 0) pick.splice(k, 1); else pick.push(i); } else pick = [i];
          Array.prototype.forEach.call(list.children, function (x, j) { x.setAttribute('aria-pressed', String(pick.indexOf(j) >= 0)); });
          go.disabled = !pick.length;
        });
        list.appendChild(b);
      });
      box.appendChild(list);
      var go = el('button', 'qk-cta', show ? '다시 고르기' : '투표하기'); go.type = 'button';
      if (closed) go.hidden = true; else if (!show) go.disabled = !pick.length;
      go.addEventListener('click', function () {
        if (show) { self._mine = null; return self.render(); }
        var prev = self._mine || [];
        prev.forEach(function (i) { votes[i] = Math.max(0, (votes[i] || 0) - 1); });
        pick.forEach(function (i) { votes[i] = (votes[i] || 0) + 1; });
        self._mine = pick.slice();
        self.setAttribute('votes', JSON.stringify(votes));
        self.dispatchEvent(new CustomEvent('vote', { detail: { choices: pick.slice(), labels: pick.map(function (i) { return opts[i]; }) }, bubbles: true }));
      });
      box.appendChild(go);
      this.appendChild(box);
    }
  }

  // ── 24. D-day ──────────────────────────────────────────────────
  // <quoka-countdown to="2026-11-28T09:00" title="경기교육연구 페스타 2026" place="수원컨벤션센터">
  // 일 · 시 · 분 · 초가 줄어들고, 다가올수록 쿼카가 설렌다(7일 넘게 미소 → 일주일 안 기뻐요 → 사흘 안 신나요 → 당일 월계관). 끝나면 고마움 인사.
  class QuokaCountdown extends Base {
    static get observedAttributes() { return ['to', 'title', 'place']; }
    connectedCallback() { ensureStyle(); this.render(); var self = this; this._t = setInterval(function () { self.tick(); }, 1000); }
    disconnectedCallback() { clearInterval(this._t); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    target() { var s = this.getAttribute('to') || ''; var m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{2}))?/.exec(s); return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null; }
    render() {
      var a = this.getAttribute.bind(this);
      this.className = 'qk';
      this.innerHTML = '';
      var box = el('div', 'qk-cd');
      this._face = faceImg({ expression: 'smile', motion: 'idle' }, 76, '');
      box.appendChild(this._face);
      var main = el('div', 'qk-cd-main');
      main.appendChild(el('span', 'ttl', esc(a('title') || '')));
      this._dd = el('b', 'dd');
      main.appendChild(this._dd);
      this._units = el('div', 'units'); this._units.setAttribute('aria-hidden', 'true');
      main.appendChild(this._units);
      if (a('place')) main.appendChild(el('small', '', esc(a('place'))));
      box.appendChild(main);
      this._sr = el('span', 'qk-sr'); this._sr.setAttribute('aria-live', 'off'); box.appendChild(this._sr);
      this.appendChild(box);
      this._mood = null;
      this.tick();
    }
    tick() {
      var to = this.target(); if (!to || !this._dd) return;
      var now = new Date(), ms = to - now;
      var dayN = dayDiff(new Date(to.getFullYear(), to.getMonth(), to.getDate()), new Date(now.getFullYear(), now.getMonth(), now.getDate()));
      var mood = ms <= 0 && dayN < 0 ? 'happy' : (dayN <= 3 ? 'excited' : (dayN <= 7 ? 'happy' : 'smile'));
      if (mood !== this._mood) { this._mood = mood; this._face.src = Q.url({ expression: mood, motion: dayN <= 3 && dayN >= 0 ? 'aha' : 'idle', accessory: dayN === 0 ? 'laurel' : undefined }); }
      if (ms <= 0 && dayN < 0) { this._dd.textContent = '끝났어요'; this._units.innerHTML = '<span class="thx">함께해 주셔서 고마워요!</span>'; this._sr.textContent = '행사가 끝났어요'; return; }
      this._dd.textContent = dayN === 0 ? 'D-DAY' : 'D-' + dayN;
      var s = Math.max(0, Math.floor(ms / 1000)), parts = [[Math.floor(s / 86400), '일'], [Math.floor(s % 86400 / 3600), '시간'], [Math.floor(s % 3600 / 60), '분'], [s % 60, '초']];
      this._units.innerHTML = parts.map(function (p) { return '<span><b>' + ('0' + p[0]).slice(-2) + '</b><small>' + p[1] + '</small></span>'; }).join('');
      this._sr.textContent = (this.getAttribute('title') || '') + '까지 ' + parts[0][0] + '일 ' + parts[1][0] + '시간 남았어요';
    }
  }

  // ── 25. 자주 묻는 질문 ──────────────────────────────────────────
  // <quoka-faq search><details><summary>질문</summary><p>답</p></details>…</quoka-faq>
  // 안의 details를 쿼카 말풍선 모양으로 다듬고, search면 위에 찾기 칸을 붙인다. 답 앞에 작은 쿼카가 앉는다.
  class QuokaFaq extends Base {
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._ready) self.init(); }); }
    init() {
      var self = this; this._ready = true;
      this.classList.add('qk', 'qk-faq');
      var items = Array.prototype.slice.call(this.querySelectorAll('details'));
      var face = Q.url({ expression: 'smile' });
      items.forEach(function (d) {
        var ans = Array.prototype.filter.call(d.children, function (c) { return c.tagName !== 'SUMMARY'; });
        if (!ans.length || d.querySelector('.qk-faq-a')) return;
        var wrap = el('div', 'qk-faq-a', '<img alt="" width="34" height="34" src="' + face + '">');
        var inner = el('div', ''); ans.forEach(function (n) { inner.appendChild(n); }); wrap.appendChild(inner);
        d.appendChild(wrap);
      });
      if (this.hasAttribute('search')) {
        var bar = el('label', 'qk-faq-find', '<quoka-icon name="search" size="22"></quoka-icon>');
        var inp = document.createElement('input'); inp.type = 'search'; inp.placeholder = this.getAttribute('search') || '궁금한 걸 찾아보세요'; inp.setAttribute('aria-label', '질문 찾기');
        var none = el('p', 'qk-faq-none', '맞는 질문이 없어요. 묻고 답하기에 남겨 주세요!'); none.hidden = true;
        bar.appendChild(inp);
        this.insertBefore(bar, this.firstChild);
        this.appendChild(none);
        inp.addEventListener('input', function () {
          var q = inp.value.trim().toLowerCase(), n = 0;
          items.forEach(function (d) { var hit = !q || d.textContent.toLowerCase().indexOf(q) >= 0; d.hidden = !hit; if (hit) n++; if (q && hit) d.open = true; });
          none.hidden = n > 0;
        });
      }
    }
  }

  // ── 홈페이지 기본 조각(1.7) ─────────────────────────────────────
  // 어느 홈페이지에나 거의 꼭 들어가는 것들. 쿼카 캘린더가 아니어도 쓴다.
  function store(k, v) { // localStorage가 막힌 곳(사생활 보호 창 등)에서도 조용히 넘어간다
    try {
      if (v === undefined) return root.localStorage.getItem(k);
      if (v === null) root.localStorage.removeItem(k); else root.localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function richTitle(s) { return esc(s || '').replace(/\\n|\n/g, '<br>').replace(/\*([^*]+)\*/g, '<em>$1</em>'); }
  var ARROW = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5.5 15.5 12 9 18.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW_L = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5.5 8.5 12 15 18.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW_R = ARROW.replace('width="16" height="16"', 'width="18" height="18"');
  function icon(name, size) { return '<quoka-icon name="' + esc(name) + '" size="' + size + '"></quoka-icon>'; }

  // ── 26. 첫 화면(히어로) ─────────────────────────────────────────
  // <quoka-hero eyebrow="경기도 AI융합교육 연구회" heading="수업을 바꾸는\n*작은 연구*" sub="…" cta="가입 신청" cta-href="/join"
  //             cta2="둘러보기" cta2-href="#about" accessory="pom-beanie" icons="archive training events idea" layout="side|center" heading-level="1">
  //   안쪽에 넣은 것(함께하는 사람 줄 같은 것)은 단추 아래에 붙어요
  // </quoka-hero>
  // 쿼카가 마우스를 따라보고, 큰 단추에 올리면 신나 해요. 둘레에 아이콘 넷이 떠 있어요. 'cta' 이벤트(detail.which = 1|2)
  class QuokaHero extends Base {
    static get observedAttributes() { return ['layout']; }
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._box) self.init(); }); }
    attributeChangedCallback() { if (this._box) this._box.classList.toggle('center', this.getAttribute('layout') === 'center'); }
    init() {
      var self = this, a = function (n) { return self.getAttribute(n); }, extra = Array.prototype.slice.call(this.childNodes);
      this.classList.add('qk');
      var box = el('section', 'qk-hero' + (a('layout') === 'center' ? ' center' : ''));
      var copy = el('div', 'qk-hero-copy');
      if (a('eyebrow')) copy.appendChild(el('p', 'qk-hero-eye', esc(a('eyebrow'))));
      var lv = Math.min(6, Math.max(1, parseInt(a('heading-level'), 10) || 1));
      copy.appendChild(el('h' + lv, 'qk-hero-h', richTitle(a('heading'))));
      if (a('sub')) copy.appendChild(el('p', 'qk-hero-sub', esc(a('sub'))));
      var btns = el('div', 'qk-hero-btns');
      [['cta', 'cta-href', 1], ['cta2', 'cta2-href', 2]].forEach(function (c) {
        if (!a(c[0])) return;
        var b = el(a(c[1]) ? 'a' : 'button', 'qk-hero-btn' + (c[2] === 2 ? ' ghost' : ''), esc(a(c[0])));
        if (a(c[1])) b.href = a(c[1]); else b.type = 'button';
        b.addEventListener('click', function () { self.dispatchEvent(new CustomEvent('cta', { detail: { which: c[2], href: a(c[1]) }, bubbles: true })); });
        if (c[2] === 1) ['mouseenter', 'focus'].forEach(function (ev) { b.addEventListener(ev, function () { self.mood('excited'); }); });
        if (c[2] === 1) ['mouseleave', 'blur'].forEach(function (ev) { b.addEventListener(ev, function () { self.mood(); }); });
        btns.appendChild(b);
      });
      if (btns.children.length) copy.appendChild(btns);
      if (extra.some(function (n) { return n.nodeType === 1 || n.textContent.trim(); })) {
        var ex = el('div', 'qk-hero-extra'); extra.forEach(function (n) { ex.appendChild(n); }); copy.appendChild(ex);
      }
      var fig = el('div', 'qk-hero-fig');
      box.appendChild(copy); box.appendChild(fig);
      this.appendChild(box);
      this._box = box; this._fig = fig;
      this.buildFig();
    }
    buildFig() { // 쿼카 + 둘레에 둥실 뜬 아이콘 넷
      var a = this.getAttribute.bind(this), fig = this._fig;
      var icons = (a('icons') == null ? 'archive training events idea' : a('icons')).split(/\s+/).filter(Boolean).slice(0, 4);
      fig.innerHTML = '';
      var stage = el('div', 'qk-hero-stage');
      var face = document.createElement('quoka-face');
      face.setAttribute('live', ''); face.setAttribute('follow', ''); face.setAttribute('size', '240');
      face.setAttribute('sleep-after', '0');
      face.setAttribute('expression', a('expression') || 'smile');
      if (a('accessory')) face.setAttribute('accessory', a('accessory'));
      face.setAttribute('label', a('label') || '쿼카');
      stage.appendChild(face);
      icons.forEach(function (n, i) {
        var orb = el('span', 'qk-hero-orb o' + i, icon(n, 40));
        orb.style.setProperty('--d', (i * -1.4) + 's'); orb.setAttribute('aria-hidden', 'true');
        orb.addEventListener('mouseenter', function () { var ic = orb.firstChild; if (ic && ic.play) ic.play(); });
        stage.appendChild(orb);
      });
      fig.appendChild(stage);
      this._face = face;
    }
    mood(ex) { if (this._face) this._face.setAttribute('expression', ex || this.getAttribute('expression') || 'smile'); }
  }

  // ── 27. 공지 띠 ────────────────────────────────────────────────
  // <quoka-banner id="join2027" href="/join" link-label="신청하기" tone="accent|ink|soft" icon="notice" dismiss>2027 분과 신청 · 11월 30일까지</quoka-banner>
  // 쪽 맨 위에 한 줄로. icon이 없으면 작은 쿼카가 앉아요. dismiss면 × 단추가 붙고, 닫으면 이 브라우저에선 다시 안 보여요(id로 기억).
  // 'dismiss' 이벤트 · el.reset() 다시 보이기
  class QuokaBanner extends Base {
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._bar) self.init(); }); }
    key() { return 'qk-banner:' + (this.id || this.getAttribute('key') || this._text || ''); }
    init() {
      var self = this, a = function (n) { return self.getAttribute(n); }, msg = Array.prototype.slice.call(this.childNodes);
      this._text = this.textContent.trim().slice(0, 40);
      this.classList.add('qk');
      if (this.hasAttribute('dismiss') && store(this.key()) === '1') this.hidden = true;
      var bar = el('div', 'qk-banner ' + (/^(ink|soft)$/.test(a('tone')) ? a('tone') : 'accent'));
      bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', a('label') || '알림');
      bar.appendChild(el('span', 'ic', a('icon') ? icon(a('icon'), 24) : '<img alt="" width="28" height="28" src="' + Q.url({ expression: a('expression') || 'smile' }) + '">'));
      var t = el('p', 'tx'); msg.forEach(function (n) { t.appendChild(n); }); bar.appendChild(t);
      if (a('href')) { var l = el('a', 'go', esc(a('link-label') || '자세히') + ARROW); l.href = a('href'); bar.appendChild(l); }
      if (this.hasAttribute('dismiss')) {
        var x = el('button', 'x', '&times;'); x.type = 'button'; x.setAttribute('aria-label', '이 알림 닫기');
        x.addEventListener('click', function () { self.dismiss(); });
        bar.appendChild(x);
      }
      this.appendChild(bar); this._bar = bar;
    }
    dismiss() {
      var self = this;
      store(this.key(), '1');
      this._bar.classList.add('bye');
      setTimeout(function () { self.hidden = true; self._bar.classList.remove('bye'); }, reduceMotion() ? 0 : 260);
      this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true }));
    }
    reset() { store(this.key(), null); this.hidden = false; }
  }

  // ── 28. 특징 칸 ────────────────────────────────────────────────
  // <quoka-features cols="3">
  //   <div data-icon="archive" data-title="수업 자료 나눔" data-href="/archive" data-more="자료실 가기">설명 한두 줄</div> …
  // </quoka-features>
  // "우리는 이런 걸 해요". 칸에 올리면 아이콘이 뜻에 맞게 움직여요. data-href가 있으면 칸 전체가 링크. 휴대폰에선 한 줄에 하나, 아이콘이 왼쪽.
  class QuokaFeatures extends Base {
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._ready) self.init(); }); }
    init() {
      this._ready = true;
      var items = Array.prototype.slice.call(this.children), cols = parseInt(this.getAttribute('cols'), 10) || Math.min(3, items.length || 3);
      this.classList.add('qk');
      var grid = el('div', 'qk-feats'); grid.style.setProperty('--cols', cols);
      items.forEach(function (it) {
        var d = it.dataset, card = el(d.href ? 'a' : 'div', 'qk-feat');
        if (d.href) card.href = d.href;
        card.innerHTML = '<span class="ic">' + icon(d.icon || 'idea', 40) + '</span><b>' + esc(d.title || '') + '</b>';
        var p = el('p', ''); while (it.firstChild) p.appendChild(it.firstChild); card.appendChild(p);
        if (d.href) card.appendChild(el('span', 'more', esc(d.more || '자세히 보기') + ARROW));
        else card.addEventListener('mouseenter', function () { var ic = card.querySelector('quoka-icon'); if (ic && ic.play) ic.play(); });
        grid.appendChild(card);
      });
      this.innerHTML = '';
      this.appendChild(grid);
    }
  }

  // ── 29. 연혁 ───────────────────────────────────────────────────
  // <quoka-timeline>
  //   <div data-date="2026.03" data-title="분과를 새로 꾸렸어요" data-item="sprout">설명</div> …
  //   <div data-date="2026.11" data-title="연구 페스타" data-item="laurel" data-now>…</div>
  // </quoka-timeline>
  // 마디마다 쿼카가 그때의 아이템을 쓰고 있어요(data-item = 아이템, data-expression = 표정). data-now = 지금 칸. 보이면 차례로 나타나요.
  // 넓으면 날짜 | 쿼카 | 내용 세 칸, 좁으면 쿼카 | 날짜·내용 두 칸.
  class QuokaTimeline extends Base {
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._ready) self.init(); }); }
    init() {
      this._ready = true;
      var items = Array.prototype.slice.call(this.children);
      this.classList.add('qk');
      var ol = el('ol', 'qk-tl');
      items.forEach(function (it, i) {
        var d = it.dataset, now = 'now' in d, li = el('li', 'qk-tl-item' + (now ? ' now' : ''));
        li.style.setProperty('--i', i);
        if (now) li.setAttribute('aria-current', 'step');
        li.appendChild(el('span', 'dt', esc(d.date || '') + (now ? '<i>지금</i>' : '')));
        li.appendChild(faceImg({ expression: d.expression || (now ? 'excited' : 'smile'), accessory: d.item ? d.item.split(/[\s,]+/) : [] }, now ? 52 : 44, ''));
        var body = el('div', 'qk-tl-body', '<b>' + esc(d.title || '') + '</b>');
        if (it.textContent.trim() || it.children.length) { var p = el('p', ''); while (it.firstChild) p.appendChild(it.firstChild); body.appendChild(p); }
        li.appendChild(body);
        ol.appendChild(li);
      });
      this.innerHTML = '';
      this.appendChild(ol);
      if (!reduceMotion() && root.IntersectionObserver) { // 한 칸씩 화면에 들어올 때 나타난다(긴 연혁도 안전하게)
        ol.classList.add('anim');
        var io = new IntersectionObserver(function (es) {
          var k = 0;
          es.forEach(function (e) { if (e.isIntersecting) { e.target.style.setProperty('--k', k++); e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -6% 0px' });
        Array.prototype.forEach.call(ol.children, function (li) { io.observe(li); });
      }
    }
  }

  // ── 30. 사진첩 ─────────────────────────────────────────────────
  // <quoka-gallery cols="3" limit="6" blur>
  //   <img src="…" alt="11월 정기모임" data-caption="11월 정기모임" data-faces="32,40,7;58,38,7"> …
  // </quoka-gallery>
  // 누르면 크게 보기(← → 키 · 옆으로 밀기 · Esc). limit을 넘는 사진은 「더 보기」로. blur면 data-faces 자리를 흐리게 덮어요.
  // data-faces = 얼굴 자리 "가로%,세로%,반지름%" 를 ;로 이어요(반지름은 사진 너비 기준).
  // ※ 화면에서만 덮는 거라 원본 파일은 그대로예요. 공개하는 곳엔 <quoka-photo-blur>나 QuokaKit.blurFaces()로 진짜로 가린 사진을 올려 주세요.
  function parseFaces(s) {
    return String(s || '').split(';').map(function (t) {
      var n = t.split(',').map(parseFloat);
      return n.length >= 3 && n.every(function (v) { return isFinite(v); }) ? { x: n[0], y: n[1], r: n[2] } : null;
    }).filter(Boolean);
  }
  function faceVeils(faces, cls) { return faces.map(function () { return '<i class="qk-veil' + (cls ? ' ' + cls : '') + '" aria-hidden="true"></i>'; }).join(''); }
  function placeVeils(wrap, img, faces, fit) { // object-fit(cover|contain)에 맞춰 얼굴 덮개 자리를 잡는다
    var nw = img.naturalWidth, nh = img.naturalHeight, bw = img.clientWidth, bh = img.clientHeight;
    if (!nw || !bw) return;
    var s = fit === 'contain' ? Math.min(bw / nw, bh / nh) : Math.max(bw / nw, bh / nh);
    var ox = (bw - nw * s) / 2 + img.offsetLeft, oy = (bh - nh * s) / 2 + img.offsetTop;
    var vs = wrap.querySelectorAll('.qk-veil');
    faces.forEach(function (f, i) {
      var v = vs[i]; if (!v) return;
      var r = f.r / 100 * nw * s;
      v.style.left = (ox + f.x / 100 * nw * s) + 'px'; v.style.top = (oy + f.y / 100 * nh * s) + 'px';
      v.style.width = (2 * r) + 'px'; v.style.height = (2 * r * 1.15) + 'px';
    });
  }
  var veilRO = null;
  function watchVeils(img, fn) {
    img._qkPlace = fn;
    if (img.complete && img.naturalWidth) fn(); else img.addEventListener('load', fn);
    if (root.ResizeObserver) {
      if (!veilRO) veilRO = new ResizeObserver(function (es) { es.forEach(function (e) { if (e.target._qkPlace) e.target._qkPlace(); }); });
      veilRO.observe(img);
    }
  }
  var LB = null;
  function openLightbox(items, start, blur) {
    ensureStyle();
    if (!LB) {
      var d = el('dialog', 'qk qk-lb');
      d.setAttribute('aria-label', '사진 크게 보기');
      d.innerHTML = '<div class="qk-lb-top"><span class="n" aria-live="polite"></span><button type="button" class="x" aria-label="닫기">&times;</button></div>' +
        '<div class="qk-lb-stage"><button type="button" class="nav prev" aria-label="이전 사진">' + ARROW_L + '</button>' +
        '<div class="fr"><img alt=""></div>' +
        '<button type="button" class="nav next" aria-label="다음 사진">' + ARROW_R + '</button></div><p class="cap"></p>';
      document.body.appendChild(d);
      LB = { d: d, img: d.querySelector('.fr img'), fr: d.querySelector('.fr'), n: d.querySelector('.n'), cap: d.querySelector('.cap') };
      LB.go = function (k) { LB.i = (LB.i + k + LB.items.length) % LB.items.length; LB.show(); };
      LB.place = function () { if (LB.blur) placeVeils(LB.fr, LB.img, LB.faces, 'contain'); };
      LB.show = function () {
        var it = LB.items[LB.i];
        LB.faces = it.faces;
        Array.prototype.forEach.call(LB.fr.querySelectorAll('.qk-veil'), function (v) { v.remove(); });
        if (LB.blur) LB.fr.insertAdjacentHTML('beforeend', faceVeils(it.faces));
        LB.img.alt = it.alt; LB.img.src = it.src;
        LB.n.textContent = (LB.i + 1) + ' / ' + LB.items.length;
        LB.cap.textContent = it.caption || it.alt || '';
        if (LB.img.complete) LB.place();
      };
      d.querySelector('.x').addEventListener('click', function () { d.close(); });
      d.querySelector('.prev').addEventListener('click', function () { LB.go(-1); });
      d.querySelector('.next').addEventListener('click', function () { LB.go(1); });
      d.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') LB.go(-1); else if (e.key === 'ArrowRight') LB.go(1); });
      d.addEventListener('click', function (e) { if (e.target === d || e.target.classList.contains('qk-lb-stage')) d.close(); });
      var sx = null;
      LB.fr.addEventListener('pointerdown', function (e) { sx = e.clientX; });
      LB.fr.addEventListener('pointerup', function (e) { if (sx != null && Math.abs(e.clientX - sx) > 40 && LB.items.length > 1) LB.go(e.clientX < sx ? 1 : -1); sx = null; });
      LB.img.addEventListener('load', LB.place);
      root.addEventListener('resize', function () { if (d.open) LB.place(); });
    }
    LB.items = items; LB.blur = blur; LB.i = start;
    LB.d.classList.toggle('one', items.length < 2);
    LB.show();
    if (!LB.d.open) { if (LB.d.showModal) LB.d.showModal(); else LB.d.setAttribute('open', ''); }
    LB.d.querySelector('.x').focus();
  }
  class QuokaGallery extends Base {
    static get observedAttributes() { return ['blur']; }
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._grid) self.init(); }); }
    attributeChangedCallback() { if (this._grid) { this._grid.classList.toggle('veiled', this.hasAttribute('blur')); this._note.hidden = !this.hasAttribute('blur') || !this._hasFaces; } }
    init() {
      var self = this, imgs = Array.prototype.slice.call(this.querySelectorAll('img'));
      var limit = parseInt(this.getAttribute('limit'), 10) || 0;
      this.classList.add('qk');
      var items = imgs.map(function (im) { return { src: im.getAttribute('src'), alt: im.alt || '', caption: im.dataset.caption || '', faces: parseFaces(im.dataset.faces) }; });
      this._hasFaces = items.some(function (it) { return it.faces.length; });
      var grid = el('div', 'qk-gal' + (this.hasAttribute('blur') ? ' veiled' : ''));
      grid.style.setProperty('--cols', parseInt(this.getAttribute('cols'), 10) || 3);
      imgs.forEach(function (im, i) {
        var it = items[i], b = el('button', 'qk-gal-tile'); b.type = 'button';
        b.setAttribute('aria-label', (it.caption || it.alt || '사진 ' + (i + 1)) + ', 크게 보기');
        var fr = el('span', 'fr'); im.loading = 'lazy'; im.decoding = 'async'; fr.appendChild(im);
        if (it.faces.length) { fr.insertAdjacentHTML('beforeend', faceVeils(it.faces)); watchVeils(im, function () { placeVeils(fr, im, it.faces, 'cover'); }); }
        b.appendChild(fr);
        if (it.caption) b.appendChild(el('span', 'cap', esc(it.caption)));
        if (limit && i >= limit) b.hidden = true;
        b.addEventListener('click', function () { openLightbox(items, i, self.hasAttribute('blur')); });
        grid.appendChild(b);
      });
      this.innerHTML = '';
      this.appendChild(grid);
      var foot = el('div', 'qk-gal-foot');
      this._note = el('p', 'qk-gal-note', icon('lock', 18) + '<span>얼굴은 흐리게 가려 두었어요</span>');
      this._note.hidden = !this.hasAttribute('blur') || !this._hasFaces;
      foot.appendChild(this._note);
      if (limit && imgs.length > limit) {
        var more = el('button', 'qk-gbtn', '사진 ' + (imgs.length - limit) + '장 더 보기'); more.type = 'button';
        more.addEventListener('click', function () {
          Array.prototype.forEach.call(grid.children, function (t) { t.hidden = false; });
          more.remove();
          var first = grid.children[limit]; if (first) first.focus();
        });
        foot.appendChild(more);
      }
      this.appendChild(foot);
      this._grid = grid;
    }
  }

  // ── 31. 얼굴 가리기 ────────────────────────────────────────────
  // QuokaKit.blurFaces(사진, [{ x, y, r }], { mode: 'mosaic'|'blur', strength: 0.04, max: 2400, type: 'image/jpeg' }) → Promise<Blob>
  //   사진 = <img> · File · Blob · 주소. 얼굴 자리를 모자이크로 진짜 덮은 새 그림을 만들어요(원본은 그대로).
  // <quoka-photo-blur src="(처음 띄울 사진, 없어도 돼요)"> 사진을 고르고 → 얼굴을 누르고 → 가린 사진 받기. 'done' 이벤트(detail.blob, detail.faces)
//   내려받기를 누르면 'save' 이벤트(detail.blob, detail.filename) — 막으면(e.preventDefault()) 링크 대신 직접 저장할 수 있어요
  //   사진은 기기 밖으로 나가지 않아요. 공개 블로그·홈페이지에 올리기 전에 쓰라고 만든 조각.
  function loadSrc(src) {
    if (typeof Blob !== 'undefined' && src instanceof Blob) {
      var u = URL.createObjectURL(src);
      return loadImg(u).then(function (im) { URL.revokeObjectURL(u); return im; });
    }
    if (src && src.tagName === 'IMG') {
      return src.complete && src.naturalWidth ? Promise.resolve(src) : new Promise(function (r) { src.addEventListener('load', function () { r(src); }, { once: true }); });
    }
    return loadImg(String(src));
  }
  function blurFaces(src, faces, o) {
    o = o || {};
    return loadSrc(src).then(function (im) {
      var nw = im.naturalWidth, nh = im.naturalHeight, k = Math.min(1, (o.max || 2400) / Math.max(nw, nh));
      var W = Math.max(1, Math.round(nw * k)), H = Math.max(1, Math.round(nh * k));
      var c = document.createElement('canvas'); c.width = W; c.height = H;
      var ctx = c.getContext('2d'); ctx.drawImage(im, 0, 0, W, H);
      var cell = Math.max(6, Math.round(W * (o.strength || 0.04) * (o.mode === 'blur' ? 1.6 : 1)));
      var sm = document.createElement('canvas'); sm.width = Math.max(1, Math.ceil(W / cell)); sm.height = Math.max(1, Math.ceil(H / cell));
      sm.getContext('2d').drawImage(c, 0, 0, sm.width, sm.height);
      (faces || []).forEach(function (f) {
        var r = f.r / 100 * W;
        ctx.save();
        ctx.beginPath(); ctx.ellipse(f.x / 100 * W, f.y / 100 * H, r * 1.08, r * 1.24, 0, 0, Math.PI * 2); ctx.clip();
        ctx.imageSmoothingEnabled = o.mode === 'blur';
        ctx.drawImage(sm, 0, 0, sm.width, sm.height, 0, 0, sm.width * cell, sm.height * cell);
        ctx.restore();
      });
      return new Promise(function (r) { c.toBlob(r, o.type || 'image/jpeg', 0.9); });
    });
  }
  class QuokaPhotoBlur extends Base {
    connectedCallback() { ensureStyle(); if (!this._box) this.init(); }
    get faces() { return (this._faces || []).slice(); }
    init() {
      var self = this;
      this.classList.add('qk');
      this._faces = parseFaces(this.getAttribute('faces')); this._keep = true;
      var box = el('div', 'qk-pb');
      box.innerHTML =
        '<div class="qk-pb-head"><img class="m" alt="" width="52" height="52"><p class="say" aria-live="polite"></p></div>' +
        '<label class="qk-pb-pick"><input type="file" accept="image/*"><span>' + icon('upload', 22) + '<b>사진 고르기</b></span></label>' +
        '<div class="qk-pb-stage" hidden><div class="fr"><img class="ph" alt="얼굴을 가릴 사진"></div></div>' +
        '<div class="qk-pb-bar" hidden><label class="sz"><span>동그라미 크기</span><input type="range" min="3" max="16" step="0.5" value="7"></label>' +
        '<span class="ct"></span><button type="button" class="qk-gbtn clr">다 지우기</button><button type="button" class="qk-cta go">가린 사진 만들기</button></div>' +
        '<div class="qk-pb-out" hidden><img alt="얼굴을 가린 사진"><div class="row"><a class="qk-cta dl" download="얼굴가림.jpg">내려받기</a><small>안 받아지면 사진을 길게 누르거나 오른쪽 단추로 저장해요. 공개하는 곳엔 이 사진만 올려 주세요.</small></div></div>';
      this.appendChild(box);
      var q = function (s) { return box.querySelector(s); };
      this._box = box; this._m = q('.m'); this._say = q('.say'); this._ph = q('.ph'); this._fr = q('.fr');
      this._stage = q('.qk-pb-stage'); this._bar = q('.qk-pb-bar'); this._out = q('.qk-pb-out'); this._ct = q('.ct');
      this._size = q('.sz input');
      q('.qk-pb-pick input').addEventListener('change', function (e) { var f = e.target.files && e.target.files[0]; if (f) self.load(f); e.target.value = ''; });
      this._fr.addEventListener('click', function (e) { self.mark(e); });
      q('.clr').addEventListener('click', function () { self._faces = []; self.paint(); });
      q('.go').addEventListener('click', function () { self.make(); });
      q('.dl').addEventListener('click', function (e) { // 'save' 이벤트를 막으면(e.preventDefault) 링크 대신 홈페이지가 직접 저장한다
        var ev = new CustomEvent('save', { detail: { blob: self._blob, filename: '얼굴가림.jpg' }, bubbles: true, cancelable: true });
        self.dispatchEvent(ev);
        if (ev.defaultPrevented) e.preventDefault();
      });
      watchVeils(this._ph, function () { self.place(); });
      if (this.getAttribute('src')) this.load(this.getAttribute('src')); else this.state();
    }
    load(src) {
      var self = this;
      if (this._url) { URL.revokeObjectURL(this._url); this._url = null; }
      if (typeof Blob !== 'undefined' && src instanceof Blob) { this._url = URL.createObjectURL(src); src = this._url; }
      this._src = src;
      if (!this._keep) this._faces = []; this._keep = false;
      this._out.hidden = true;
      this._ph.onload = function () { self._stage.hidden = false; self._bar.hidden = false; self.paint(); };
      this._ph.src = src;
    }
    mark(e) {
      var rc = this._ph.getBoundingClientRect(); if (!rc.width) return;
      var x = (e.clientX - rc.left) / rc.width * 100, y = (e.clientY - rc.top) / rc.height * 100, hr = rc.height / rc.width;
      var hit = -1;
      this._faces.forEach(function (f, i) { var dx = x - f.x, dy = (y - f.y) * hr; if (Math.sqrt(dx * dx + dy * dy) < f.r * 1.1) hit = i; });
      if (hit >= 0) this._faces.splice(hit, 1);
      else this._faces.push({ x: +x.toFixed(1), y: +y.toFixed(1), r: +this._size.value });
      this._out.hidden = true;
      this.paint();
    }
    paint() {
      Array.prototype.forEach.call(this._fr.querySelectorAll('.qk-veil'), function (v) { v.remove(); });
      this._fr.insertAdjacentHTML('beforeend', faceVeils(this._faces, 'mark'));
      this.place();
      this._ct.textContent = this._faces.length ? '얼굴 ' + this._faces.length + '곳' : '';
      this._bar.querySelector('.go').disabled = !this._faces.length;
      this.state();
    }
    place() { placeVeils(this._fr, this._ph, this._faces, 'contain'); }
    state(done) {
      var has = !this._stage.hidden, n = this._faces.length;
      var s = done ? ['excited', 'sunglasses', '다 됐어요! 이 사진은 얼굴이 진짜로 덮여 있어요.']
        : !has ? ['smile', '', '얼굴이 나온 사진을 골라 주세요. 사진은 이 기기 밖으로 나가지 않아요.']
        : !n ? ['watch', '', '가릴 얼굴을 눌러 주세요. 다시 누르면 지워져요.']
        : ['happy', 'sunglasses', '얼굴 ' + n + '곳을 골랐어요. 다 골랐으면 「가린 사진 만들기」를 눌러요.'];
      this._m.src = Q.url({ expression: s[0], accessory: s[1] ? [s[1]] : [] });
      this._say.textContent = s[2];
    }
    make() {
      var self = this, go = this._bar.querySelector('.go');
      if (!this._faces.length) return;
      go.disabled = true;
      blurFaces(this._ph, this._faces).then(function (blob) {
        go.disabled = false;
        if (!blob) return;
        self._blob = blob;
        if (self._outUrl) URL.revokeObjectURL(self._outUrl);
        self._outUrl = URL.createObjectURL(blob);
        self._out.querySelector('img').src = self._outUrl;
        self._out.querySelector('.dl').href = self._outUrl;
        self._out.hidden = false;
        self.state(true);
        self.dispatchEvent(new CustomEvent('done', { detail: { blob: blob, faces: self.faces }, bubbles: true }));
      }, function () { go.disabled = false; toast('이 사진은 다른 곳에 있어서 가릴 수 없어요. 내 기기에서 골라 주세요', { mood: 'worried' }); });
    }
  }

  // ── 32. 문의하기 ───────────────────────────────────────────────
  // <quoka-contact heading="쿼카연구회에 물어보기" topics="가입 문의, 연수·강의 요청, 자료 문의, 그 밖의 것" keep="1년" action="/api/contact">
  // 이름 · 답 받을 이메일 · 갈래 · 내용(500자) · 개인정보 수집·이용 동의(필수, 펼쳐 보기). 쿼카가 쓰는 걸 지켜보고, 빠진 게 있으면 걱정해요.
  // action이 있으면 그 주소로 보내요(POST, FormData). 없으면 'send' 이벤트(detail: name, email, topic, message)를 받아 직접 보내고 el.success() · el.fail()
  // 사람 눈에 안 보이는 칸(website)이 차 있으면 스팸으로 보고 조용히 버려요.
  var cSeq = 0;
  class QuokaContact extends Base {
    connectedCallback() { ensureStyle(); if (!this._form) this.init(); }
    init() {
      var self = this, a = function (n) { return self.getAttribute(n); }, id = 'qkct' + (++cSeq);
      var topics = (a('topics') || '가입 문의, 연수·강의 요청, 자료 문의, 그 밖의 것').split(/\s*,\s*/).filter(Boolean);
      this.classList.add('qk');
      var box = el('div', 'qk-ct');
      box.innerHTML =
        '<div class="qk-ct-head"><quoka-face live size="72" expression="smile" sleep-after="0" label="문의를 받는 쿼카"' + (a('accessory') ? ' accessory="' + esc(a('accessory')) + '"' : '') + '></quoka-face>' +
        '<div><h3 id="' + id + 'h">' + esc(a('heading') || '물어보기') + '</h3><p>' + esc(a('sub') || '보통 사흘 안에 메일로 답해요.') + '</p></div></div>' +
        '<form novalidate aria-labelledby="' + id + 'h">' +
        '<label class="qk-ct-f" data-f="name"><span>이름</span><input name="name" autocomplete="name" maxlength="40" required><em class="qk-ct-err" id="' + id + 'e1"></em></label>' +
        '<label class="qk-ct-f" data-f="email"><span>답 받을 이메일</span><input name="email" type="email" autocomplete="email" inputmode="email" maxlength="120" required><em class="qk-ct-err" id="' + id + 'e2"></em></label>' +
        '<fieldset class="qk-ct-topics wide"><legend>무엇이 궁금하세요?</legend>' + topics.map(function (t, i) {
          return '<label><input type="radio" name="topic" value="' + esc(t) + '"' + (i ? '' : ' checked') + '><span>' + esc(t) + '</span></label>';
        }).join('') + '</fieldset>' +
        '<label class="qk-ct-f wide" data-f="message"><span>내용</span><textarea name="message" maxlength="500" rows="5" required placeholder="편하게 적어 주세요"></textarea><span class="qk-ct-cnt" aria-hidden="true">0 / 500</span><em class="qk-ct-err" id="' + id + 'e3"></em></label>' +
        '<div class="qk-ct-ok wide" data-f="agree"><label class="chk"><input type="checkbox" name="agree" value="yes" required><span>개인정보 수집·이용에 동의해요 <em>(필수)</em></span></label>' +
        '<details><summary>무엇을 왜 모으나요?</summary><dl><dt>모으는 것</dt><dd>이름, 이메일, 문의 내용</dd><dt>쓰는 곳</dt><dd>문의에 답하기(다른 데엔 쓰지 않아요)</dd><dt>두는 기간</dt><dd>답한 뒤 ' + esc(a('keep') || '1년') + ', 그 뒤 바로 지워요</dd></dl>' +
        '<p>동의하지 않아도 돼요. 다만 그러면 답을 보내 드릴 수 없어요.</p></details><em class="qk-ct-err" id="' + id + 'e4"></em></div>' +
        '<label class="qk-ct-hp" aria-hidden="true">홈페이지<input name="website" tabindex="-1" autocomplete="off"></label>' +
        '<p class="qk-ct-fail wide" role="alert" hidden></p>' +
        '<div class="qk-ct-send wide"><button type="submit" class="qk-ct-go">보내기</button><small>' + esc(a('note') || '개인 연락처 대신 연구회 대표 메일로 답해요.') + '</small></div>' +
        '</form>' +
        '<div class="qk-ct-done" hidden tabindex="-1"><img alt="" width="96" height="96"><b></b><p></p><button type="button" class="qk-gbtn">하나 더 물어보기</button></div>';
      this.appendChild(box);
      var f = box.querySelector('form'), face = box.querySelector('quoka-face'), q = function (s) { return box.querySelector(s); };
      this._form = f; this._face = face; this._done = q('.qk-ct-done'); this._fail = q('.qk-ct-fail'); this._go = q('.qk-ct-go');
      var errIds = { name: id + 'e1', email: id + 'e2', message: id + 'e3', agree: id + 'e4' };
      Object.keys(errIds).forEach(function (k) { f.elements[k].setAttribute('aria-describedby', errIds[k]); });
      var cnt = q('.qk-ct-cnt'), talkT = 0;
      f.addEventListener('focusin', function () { self.mood('watch'); });
      f.addEventListener('focusout', function () { setTimeout(function () { if (!f.contains(document.activeElement)) self.mood('smile'); }, 0); });
      f.addEventListener('input', function (e) {
        var t = e.target, wrap = t.closest('[data-f]');
        if (wrap && wrap.classList.contains('bad')) self.check(wrap.dataset.f);
        if (t.name === 'message') {
          cnt.textContent = t.value.length + ' / 500';
          cnt.classList.toggle('full', t.value.length >= 480);
          if (face.talk) { face.talk(true); clearTimeout(talkT); talkT = setTimeout(function () { face.talk(false); }, 700); }
        }
      });
      f.addEventListener('change', function (e) { if (e.target.name === 'agree') { self.check('agree'); if (e.target.checked) self.mood('happy'); } });
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (f.elements.website.value) return self.success();
        var bad = ['name', 'email', 'message', 'agree'].filter(function (k) { return !self.check(k); });
        if (bad.length) {
          self.mood('worried'); if (face.react) face.react('shake');
          f.elements[bad[0]].focus();
          return;
        }
        self._fail.hidden = true;
        var data = { name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), topic: (f.querySelector('[name=topic]:checked') || {}).value || '', message: f.elements.message.value.trim() };
        self._go.disabled = true; self._go.textContent = '보내는 중…';
        self.dispatchEvent(new CustomEvent('send', { detail: data, bubbles: true }));
        if (a('action') && root.fetch) {
          root.fetch(a('action'), { method: 'POST', body: new FormData(f) }).then(function (r) { if (r.ok) self.success(); else self.fail(); }, function () { self.fail(); });
        }
      });
      q('.qk-ct-done button').addEventListener('click', function () { self.reset(); });
    }
    mood(ex) { if (this._face && this._face.getAttribute('expression') !== ex) this._face.setAttribute('expression', ex); }
    check(k) {
      var f = this._form, v = f.elements[k], wrap = v.closest('[data-f]'), msg = '';
      if (k === 'name' && !v.value.trim()) msg = '이름을 적어 주세요';
      if (k === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.value.trim())) msg = v.value.trim() ? '이메일 모양을 한 번 더 봐 주세요' : '답을 받을 이메일을 적어 주세요';
      if (k === 'message' && !v.value.trim()) msg = '궁금한 걸 적어 주세요';
      if (k === 'agree' && !v.checked) msg = '동의해야 답을 보낼 수 있어요';
      wrap.classList.toggle('bad', !!msg);
      v.setAttribute('aria-invalid', String(!!msg));
      wrap.querySelector('.qk-ct-err').textContent = msg;
      return !msg;
    }
    success(title, text) {
      var email = this._form.elements.email.value.trim();
      this._go.disabled = false; this._go.textContent = '보내기';
      this._form.hidden = true;
      var d = this._done;
      d.querySelector('img').src = Q.url({ expression: 'excited', accessory: ['laurel'] });
      d.querySelector('b').textContent = title || '잘 받았어요!';
      d.querySelector('p').textContent = text || (email ? email + '로 답을 보내 드릴게요.' : '곧 답을 보내 드릴게요.');
      d.hidden = false; d.focus();
      this.mood('happy');
    }
    fail(msg) {
      this._go.disabled = false; this._go.textContent = '다시 보내기';
      this._fail.textContent = msg || '보내지 못했어요. 잠시 뒤에 다시 눌러 주세요.';
      this._fail.hidden = false;
      this.mood('sad');
    }
    reset() {
      var f = this._form;
      f.reset(); f.hidden = false; this._done.hidden = true; this._fail.hidden = true;
      this._go.disabled = false; this._go.textContent = '보내기';
      Array.prototype.forEach.call(f.querySelectorAll('.bad'), function (w) { w.classList.remove('bad'); });
      Array.prototype.forEach.call(f.querySelectorAll('.qk-ct-err'), function (e) { e.textContent = ''; });
      f.querySelector('.qk-ct-cnt').textContent = '0 / 500';
      this.mood('smile');
      f.elements.name.focus();
    }
  }

  // ── 33. 바닥글 ─────────────────────────────────────────────────
  // <quoka-footer brand="쿼카연구회" sub="경기도 AI융합교육 연구회" email="hello@quoka.example"
  //               sns='{"instagram":"https://…","youtube":"https://…","blog":"https://…","band":"https://…"}'
  //               privacy-href="/privacy" terms-href="/terms" since="2024">
  //   <div data-title="연구회"><a href="/about">소개</a><a href="/members">함께하는 사람</a></div> …
  // </quoka-footer>
  // 바닥글이 보이면 쿼카가 위로 빼꼼 고개를 내밀어요. SNS는 상표 그림 없이 글자 + 키트 아이콘으로.
  // 개인 휴대폰·계좌는 넣지 말고, 연구회 대표 메일만 두세요. 개인정보처리방침은 굵게(법에서 눈에 띄게 하라고 해요).
  var SNS = { instagram: ['인스타그램', 'camera'], youtube: ['유튜브', 'video'], blog: ['블로그', 'news'], band: ['밴드', 'community'],
    cafe: ['카페', 'coffee'], kakao: ['카카오톡 채널', 'message'], padlet: ['패들렛', 'link'], site: ['홈페이지', 'home'] };
  class QuokaFooter extends Base {
    connectedCallback() { ensureStyle(); var self = this; whenParsed(function () { if (self.isConnected && !self._ft) self.init(); }); }
    init() {
      var self = this, a = function (n) { return self.getAttribute(n); };
      var groups = Array.prototype.slice.call(this.children).filter(function (c) { return c.dataset.title != null || c.querySelector('a'); });
      var sns = {}; try { sns = JSON.parse(a('sns') || '{}') || {}; } catch (e) { sns = {}; }
      this.classList.add('qk');
      var ft = el('footer', 'qk-ft');
      ft.innerHTML = '<span class="qk-ft-peek" aria-hidden="true"><img alt="" width="76" height="76" src="' + Q.url({ expression: 'smile', accessory: a('accessory') ? a('accessory').split(/\s+/) : [] }) + '"></span>';
      var top = el('div', 'qk-ft-top'), brand = el('div', 'qk-ft-brand');
      brand.innerHTML = '<b><img alt="" width="34" height="34" src="' + Q.url({ expression: 'smile' }) + '">' + esc(a('brand') || '') + '</b>' +
        (a('sub') ? '<p>' + esc(a('sub')) + '</p>' : '') +
        (a('email') ? '<a class="mail" href="mailto:' + esc(a('email')) + '">' + esc(a('email')) + '</a>' : '');
      var keys = Object.keys(sns).filter(function (k) { return sns[k]; });
      if (keys.length) {
        var s = el('div', 'qk-ft-sns');
        keys.forEach(function (k) {
          var m = SNS[k] || [k, 'link'], l = el('a', '', icon(m[1], 22) + '<span>' + esc(m[0]) + '</span>');
          l.href = sns[k]; l.target = '_blank'; l.rel = 'noopener'; l.setAttribute('aria-label', m[0] + ' (새 창)');
          s.appendChild(l);
        });
        brand.appendChild(s);
      }
      top.appendChild(brand);
      if (groups.length) {
        var cols = el('div', 'qk-ft-cols');
        groups.forEach(function (g) {
          var col = el('nav', 'qk-ft-col'); col.setAttribute('aria-label', g.dataset.title || '바로가기');
          if (g.dataset.title) col.appendChild(el('h4', '', esc(g.dataset.title)));
          var ul = el('ul', '');
          Array.prototype.forEach.call(g.querySelectorAll('a'), function (x) { var li = el('li', ''); li.appendChild(x); ul.appendChild(li); });
          col.appendChild(ul); cols.appendChild(col);
        });
        top.appendChild(cols);
      }
      ft.appendChild(top);
      var y = new Date().getFullYear(), since = parseInt(a('since'), 10);
      var bot = el('div', 'qk-ft-bot', '<span class="cp">© ' + (since && since < y ? since + '–' : '') + y + ' ' + esc(a('copyright') || a('brand') || '') + '</span>');
      if (a('privacy-href')) bot.insertAdjacentHTML('beforeend', '<a class="pv" href="' + esc(a('privacy-href')) + '">개인정보처리방침</a>');
      if (a('terms-href')) bot.insertAdjacentHTML('beforeend', '<a href="' + esc(a('terms-href')) + '">이용약관</a>');
      ft.appendChild(bot);
      this.innerHTML = '';
      this.appendChild(ft);
      this._ft = ft;
      if (reduceMotion() || !root.IntersectionObserver) ft.classList.add('in');
      else onVisible(ft, function () { ft.classList.add('in'); });
    }
  }

  // ── 34. 맨 위로 ────────────────────────────────────────────────
  // <quoka-totop threshold="600" side="right|left"></quoka-totop>
  // 화면을 내리면 오른쪽 아래에 나타나고, 둘레 고리가 읽은 만큼 차요. 누르면 쿼카가 폴짝 하며 맨 위로. 떠 있는 쿼카 도우미가 있으면 그 위로 비켜요.
  class QuokaTotop extends Base {
    connectedCallback() {
      ensureStyle();
      var self = this;
      if (!this._b) {
        this.classList.add('qk');
        var b = el('button', 'qk-top' + (this.getAttribute('side') === 'left' ? ' left' : ''));
        b.type = 'button'; b.setAttribute('aria-label', '맨 위로');
        b.innerHTML = '<svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24.5"/><circle class="p" cx="26" cy="26" r="24.5" pathLength="100"/></svg>' +
          '<svg class="up" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 14.5 12 8.5l6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        this._f = faceImg({ expression: 'smile' }, 32, '');
        b.appendChild(this._f);
        b.addEventListener('mouseenter', function () { self._f.src = Q.url({ expression: 'excited' }); });
        b.addEventListener('mouseleave', function () { self._f.src = Q.url({ expression: 'smile' }); });
        b.addEventListener('click', function () {
          root.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
          b.classList.remove('hop'); void b.offsetWidth; b.classList.add('hop');
          var t = document.querySelector(self.getAttribute('focus') || 'h1');
          if (t) { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
          self.dispatchEvent(new CustomEvent('totop', { bubbles: true }));
        });
        this.appendChild(b);
        this._b = b; this._p = b.querySelector('.p');
      }
      this._h = function () { if (self._raf) return; self._raf = requestAnimationFrame(function () { self._raf = 0; self.update(); }); };
      root.addEventListener('scroll', this._h, { passive: true });
      root.addEventListener('resize', this._h);
      this.update();
    }
    disconnectedCallback() { root.removeEventListener('scroll', this._h); root.removeEventListener('resize', this._h); }
    update() {
      var de = document.documentElement, y = root.scrollY || de.scrollTop, max = Math.max(1, de.scrollHeight - root.innerHeight);
      var on = y > (parseFloat(this.getAttribute('threshold')) || 600);
      this._b.classList.toggle('show', on);
      this._b.tabIndex = on ? 0 : -1;
      this._p.style.strokeDashoffset = String(100 - Math.min(100, y / max * 100));
    }
  }

  // ── 35. 다크 모드 단추 ─────────────────────────────────────────
  // <quoka-theme label></quoka-theme>  <html data-theme="dark|light">를 바꾸고 이 브라우저에 기억해요(localStorage 'qk-theme').
  // 밝을 땐 쿼카가 깨어 있고, 어두우면 털모자를 쓰고 잠들어요. 'theme' 이벤트(detail.theme) · QuokaKit.setTheme('dark') · QuokaKit.theme()
  // 홈페이지 CSS에는 :root[data-theme="dark"]{ … } 에 어두운 색을 두세요. 처음엔 기기 설정(밝게·어둡게)을 따라요.
  var THEME_KEY = 'qk-theme';
  function currentTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return root.matchMedia && root.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function setTheme(t) {
    if (t !== 'dark' && t !== 'light') { document.documentElement.removeAttribute('data-theme'); store(THEME_KEY, null); }
    else { document.documentElement.setAttribute('data-theme', t); store(THEME_KEY, t); }
    Array.prototype.forEach.call(document.querySelectorAll('quoka-theme'), function (x) { if (x.sync) x.sync(); });
    document.dispatchEvent(new CustomEvent('quoka-theme', { detail: { theme: currentTheme() } }));
    return currentTheme();
  }
  if (typeof document !== 'undefined') { var savedTheme = store(THEME_KEY); if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.setAttribute('data-theme', savedTheme); }
  class QuokaTheme extends Base {
    connectedCallback() {
      ensureStyle();
      var self = this;
      if (!this._b) {
        this.classList.add('qk');
        var b = el('button', 'qk-theme'); b.type = 'button'; b.setAttribute('role', 'switch'); b.setAttribute('aria-label', '어두운 화면');
        b.innerHTML = '<span class="trk" aria-hidden="true"><i></i><i></i><i></i><span class="knob"><img alt="" width="24" height="24"></span></span>' + (this.hasAttribute('label') ? '<span class="lb" aria-hidden="true"></span>' : '');
        b.addEventListener('click', function () {
          var t = setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
          self.dispatchEvent(new CustomEvent('theme', { detail: { theme: t }, bubbles: true }));
        });
        this.appendChild(b); this._b = b; this._img = b.querySelector('img'); this._lb = b.querySelector('.lb');
        if (root.matchMedia) { var mq = root.matchMedia('(prefers-color-scheme: dark)'); if (mq.addEventListener) mq.addEventListener('change', function () { self.sync(); }); }
      }
      this.sync();
    }
    sync() {
      if (!this._b) return;
      var d = currentTheme() === 'dark';
      this._b.classList.toggle('dark', d);
      this._b.setAttribute('aria-checked', String(d));
      this._img.src = Q.url({ expression: d ? 'sleep' : 'smile', accessory: d ? ['pom-beanie'] : [] });
      if (this._lb) this._lb.textContent = d ? '어둡게' : '밝게';
    }
  }

  // ── 36. 쪽 번호 ────────────────────────────────────────────────
  // <quoka-pager total="12" page="3" href="?page={n}"></quoka-pager>
  // 1 … 4 5 6 … 12. 지금 쪽 번호엔 쿼카 귀가 쫑긋. 좁으면 ‹ 3 / 12 › 로 줄어요.
  // href가 있으면 링크, 없으면 'page' 이벤트(detail.page)를 보내고 스스로 넘어가요(막으려면 e.preventDefault()).
  function pageList(p, t) {
    var out = [], i;
    if (t <= 7) { for (i = 1; i <= t; i++) out.push(i); return out; }
    var s = Math.max(2, p - 1), e = Math.min(t - 1, p + 1);
    if (p <= 3) { s = 2; e = 4; }
    if (p >= t - 2) { s = t - 3; e = t - 1; }
    out.push(1); if (s > 2) out.push(0);
    for (i = s; i <= e; i++) out.push(i);
    if (e < t - 1) out.push(0); out.push(t);
    return out;
  }
  class QuokaPager extends Base {
    static get observedAttributes() { return ['total', 'page', 'href']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var self = this, tpl = this.getAttribute('href');
      var total = Math.max(1, parseInt(this.getAttribute('total'), 10) || 1);
      var page = Math.min(total, Math.max(1, parseInt(this.getAttribute('page'), 10) || 1));
      var had = this.contains(document.activeElement), focusKey = had && document.activeElement.dataset ? document.activeElement.dataset.k : null;
      this.classList.add('qk');
      this.innerHTML = '';
      var nav = el('nav', 'qk-pager'); nav.setAttribute('aria-label', this.getAttribute('label') || '쪽 번호');
      function item(n, label, cls, aria, key) {
        var off = n < 1 || n > total, cur = !cls && n === page;
        var x = el(tpl && !off && !cur ? 'a' : 'button', 'qk-pg' + (cls ? ' ' + cls : ''), label);
        x.dataset.k = key || String(n);
        if (x.tagName === 'A') x.href = tpl.replace('{n}', n); else { x.type = 'button'; if (off) x.disabled = true; }
        if (aria) x.setAttribute('aria-label', aria); else x.setAttribute('aria-label', n + '쪽');
        if (cur) x.setAttribute('aria-current', 'page');
        x.addEventListener('click', function (e) {
          if (off || cur) { e.preventDefault(); return; }
          var ev = new CustomEvent('page', { detail: { page: n }, bubbles: true, cancelable: true });
          self.dispatchEvent(ev);
          if (ev.defaultPrevented) { e.preventDefault(); return; }
          if (!tpl) self.setAttribute('page', String(n));
        });
        return x;
      }
      nav.appendChild(item(page - 1, ARROW_L, 'arr', '앞쪽', 'prev'));
      pageList(page, total).forEach(function (n) { nav.appendChild(n ? item(n, String(n)) : el('span', 'qk-pg-gap', '…')); });
      var mini = el('span', 'qk-pg-mini', '<b>' + page + '</b> / ' + total); mini.setAttribute('aria-hidden', 'true');
      nav.appendChild(mini);
      nav.appendChild(item(page + 1, ARROW_R, 'arr', '뒤쪽', 'next'));
      this.appendChild(nav);
      if (focusKey) { var t = nav.querySelector('[data-k="' + focusKey + '"]:not([disabled])') || nav.querySelector('[aria-current]'); if (t) t.focus(); }
    }
  }

  // ── 37. 불러오는 중 뼈대 ────────────────────────────────────────
  // <quoka-skeleton type="post|file|card|text" count="3"></quoka-skeleton>
  // 글이 오기 전 자리를 미리 잡아 화면이 덜컥거리지 않게 해요. 다 오면 이 태그를 지우거나 hidden. 동작 줄이기면 깜빡이지 않아요.
  var SK = {
    post: '<i class="c"></i><span><i class="l" style="width:34%"></i><i class="l" style="width:82%"></i><i class="l s" style="width:26%"></i></span>',
    file: '<i class="sq"></i><span><i class="l" style="width:64%"></i><i class="l s" style="width:38%"></i></span><i class="pill"></i>',
    card: '<i class="img"></i><i class="l" style="width:58%"></i><i class="l s" style="width:88%"></i><i class="l s" style="width:44%"></i>',
    text: '<i class="l" style="width:100%"></i><i class="l" style="width:94%"></i><i class="l" style="width:61%"></i>'
  };
  class QuokaSkeleton extends Base {
    static get observedAttributes() { return ['type', 'count']; }
    connectedCallback() { ensureStyle(); this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      var t = SK[this.getAttribute('type')] ? this.getAttribute('type') : 'post', n = Math.max(1, Math.min(24, parseInt(this.getAttribute('count'), 10) || 3));
      this.classList.add('qk');
      var w = el('div', 'qk-sk ' + t); w.setAttribute('role', 'status'); w.setAttribute('aria-busy', 'true');
      var h = '<span class="qk-sr">' + esc(this.getAttribute('label') || '불러오는 중이에요') + '</span>';
      for (var i = 0; i < n; i++) h += '<div class="row" aria-hidden="true" style="--i:' + i + '">' + SK[t] + '</div>';
      w.innerHTML = h;
      this.innerHTML = '';
      this.appendChild(w);
    }
  }

  // ── 38. 공유 단추 ──────────────────────────────────────────────
  // <quoka-share url="(없으면 지금 주소)" title="글 제목" text="한 줄 소개" round></quoka-share>
  // 휴대폰이면 기기 공유 창(카톡·밴드…), 안 되면 주소를 복사하고 알림을 띄워요. 'share' 이벤트(detail.how = 'native'|'copy')
  class QuokaShare extends Base {
    connectedCallback() {
      ensureStyle();
      if (this._b) return;
      var self = this, round = this.hasAttribute('round');
      this.classList.add('qk');
      var b = el('button', 'qk-share' + (round ? ' round' : ''), icon('share', 22) + (round ? '' : '<span>' + esc(this.getAttribute('label') || '공유') + '</span>'));
      b.type = 'button'; b.setAttribute('aria-label', this.getAttribute('label') || '공유하기');
      b.addEventListener('click', function () { self.share(); });
      this.appendChild(b); this._b = b;
    }
    share() {
      var self = this, url = this.getAttribute('url') || location.href, title = this.getAttribute('title') || document.title;
      var done = function (how) { self.dispatchEvent(new CustomEvent('share', { detail: { how: how, url: url }, bubbles: true })); };
      var copy = function () {
        var ok = function () { toast('주소를 복사했어요. 붙여 넣어 나눠 주세요', { mood: 'happy' }); done('copy'); };
        var no = function () { toast('복사가 막혀 있어요. 주소창에서 복사해 주세요', { mood: 'worried' }); };
        try { root.navigator.clipboard.writeText(url).then(ok, no); } catch (e) { no(); }
      };
      if (root.navigator && root.navigator.share && !this.hasAttribute('copy')) {
        root.navigator.share({ title: title, text: this.getAttribute('text') || '', url: url }).then(function () { done('native'); }, function (e) { if (!e || e.name !== 'AbortError') copy(); });
      } else copy();
    }
  }

  // ── 39. 쿼카마을 ───────────────────────────────────────────────
  // <quoka-village art="village/" groups="plaza ai-civic physical-ai ai-media ai-sel ai-dev ai-content"></quoka-village>
  // 분과마다 아지트가 하나씩 있는 마을. 집에 들어가면 내 쿼카로 돌아다니며
  //   화이트보드 = 포스트잇 아이디어 보드 · 회의 탁자 = 오늘 주제 · 타이머 · 출석 도장 · 책장 = 분과 자료 링크
  //   말풍선 채팅 · 표정 보내기 · 손 들기 · 「모여요」 · 「꾸미기」(가구 놓기·옮기기, 벽지, 방 공지)
  // 활동(포스트잇·자료·도장)이 쌓이면 마을 지도에서 그 집이 레벨업한다.
  // art = 힉스필드로 그린 마을 그림 폴더(map.webp · room-*.webp · items/*.webp · body-*.webp). 없으면 납작한 기본 그림.
  // 함께 쓰려면 el.adapter(QuokaKit.villageLocal() 모양)를 홈페이지 쪽 실시간 저장소에 잇는다. 없으면 이 브라우저 안에서만(탭끼리는 보임).
  // el.friends(true) = 견본 친구 셋(이 화면에만). 이벤트: enter · leave · saved · activity(detail.kind)
  var VPAL = { pink: ['#F2A3BE', '#FBD5E2', '#D97C9C'], mint: ['#82D4BE', '#CBEFE4', '#52B49A'], lavender: ['#BBA8EF', '#E3DBFB', '#9681DC'],
    white: ['#EEEAE6', '#FFFFFF', '#D3CCC5'], gray: ['#C6CCD6', '#E6E9EF', '#97A0AE'] };
  var VFLOOR = { mint: ['#E4F4EE', '#D4ECE3'], pink: ['#FBEBF1', '#F4DDE6'], lavender: ['#EEEAFB', '#E2DCF6'], gray: ['#F0F2F5', '#E3E6EC'], white: ['#FAF8F6', '#EEEAE6'] };
  var VWALLC = { mint: ['#C9ECDF', '#A7DAC6'], pink: ['#F8D9E4', '#EBB7CA'], lavender: ['#DFD7F8', '#C4B7EE'], gray: ['#E2E6ED', '#C9CFD9'], white: ['#F3F0EC', '#DED7D0'] };
  var VCOL = { pink: '핑크', mint: '민트', lavender: '라벤더', white: '하양', gray: '회색' };
  var EMOTES = [['happy', '좋아요'], ['excited', '신나요'], ['idea', '아이디어'], ['think', '음…'], ['calm', '편안']];
  function vr(x, y, w, h, r, f, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + f + '"' + (extra || '') + '/>'; }
  function vc(x, y, r, f, extra) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (extra || '') + '/>'; }

  // 가구: [이름, 가로칸, 세로칸, 종류(f 바닥 · r 깔개 · w 벽), 지나갈 수 있나, 앉을 수 있나, 하는 일, 납작 그림(그림 폴더가 없을 때)]
  // 하는 일: notes 포스트잇 보드 · meet 모임(주제·타이머·도장) · links 자료 책장
  var VITEMS = {
    table:   ['회의 탁자', 3, 2, 'f', 0, 0, 'meet', function (p) { return vr(4, 10, 124, 58, 16, p[1]) + vr(4, 54, 124, 18, 9, p[0]) + vr(16, 70, 8, 22, 4, p[2]) + vr(108, 70, 8, 22, 4, p[2]); }],
    desk:    ['책상', 2, 1, 'f', 0, 0, '', function (p) { return vr(26, 2, 34, 22, 4, '#3B4050') + vr(2, 26, 84, 16, 7, p[1]) + vr(2, 36, 84, 14, 6, p[0]); }],
    chair:   ['의자', 1, 1, 'f', 1, 1, '', function (p) { return vr(10, 0, 24, 22, 8, p[0]) + vr(7, 20, 30, 14, 7, p[1]); }],
    sofa:    ['소파', 2, 1, 'f', 1, 1, '', function (p) { return vr(6, 0, 76, 30, 13, p[0]) + vr(4, 22, 80, 24, 10, p[1]); }],
    cushion: ['방석', 1, 1, 'f', 1, 1, '', function (p) { return vr(4, 12, 36, 26, 13, p[0]) + vr(7, 13, 30, 18, 10, p[1]); }],
    shelf:   ['책장', 1, 1, 'f', 0, 0, 'links', function (p) { return vr(3, 0, 38, 82, 6, p[0]) + vr(7, 4, 30, 74, 3, p[1]); }],
    board:   ['화이트보드', 2, 1, 'f', 0, 0, 'notes', function (p) { return vr(4, 0, 80, 54, 6, '#FFFFFF', ' stroke="' + p[2] + '" stroke-width="3"'); }],
    robot:   ['로봇', 1, 1, 'f', 0, 0, '', function (p) { return vr(9, 7, 26, 20, 8, p[0]) + vr(11, 29, 22, 26, 7, '#E3E7EE'); }],
    plant:   ['화분', 1, 1, 'f', 0, 0, '', function (p) { return vc(22, 16, 14, '#7BC79B') + vr(11, 38, 22, 28, 7, p[0]); }],
    lamp:    ['스탠드', 1, 1, 'f', 0, 0, '', function (p) { return '<path d="M12 2h20l6 20H6z" fill="' + p[0] + '"/>' + vr(20, 22, 4, 40, 2, '#9AA1AE'); }],
    snack:   ['간식 탁자', 1, 1, 'f', 0, 0, '', function (p) { return vr(4, 12, 36, 16, 8, p[1]) + vr(19, 30, 6, 22, 3, p[2]); }],
    cabinet: ['장식장', 1, 1, 'f', 0, 0, '', function (p) { return vr(4, 20, 36, 52, 6, p[0]) + vr(8, 26, 28, 20, 3, p[1]); }],
    rug:     ['러그', 5, 3, 'r', 1, 0, '', null],
    notice:  ['게시판', 2, 1, 'w', 0, 0, 'notes', function (p) { return vr(6, 12, 76, 52, 6, p[1], ' stroke="' + p[0] + '" stroke-width="4"'); }],
    clock:   ['시계', 1, 1, 'w', 0, 0, '', function (p) { return vc(22, 34, 15, '#FFFFFF', ' stroke="' + p[0] + '" stroke-width="4"'); }],
    frame:   ['액자', 2, 1, 'w', 0, 0, '', function (p) { return vr(4, 14, 80, 42, 5, p[0]) + vr(9, 19, 70, 32, 3, '#FFFFFF'); }],
    pennant: ['가랜드', 3, 1, 'w', 0, 0, '', function (p) { return '<path d="M2 14Q66 40 130 14" stroke="#B9B3C3" stroke-width="2" fill="none"/>'; }]
  };
  var VITEM_ALIAS = { trophy: 'cabinet', window: 'frame' };
  var VCATS = [['가구', ['table', 'desk', 'chair', 'sofa', 'cushion', 'shelf', 'board', 'robot']], ['소품', ['plant', 'lamp', 'snack', 'cabinet', 'rug']], ['벽', ['notice', 'clock', 'frame', 'pennant']]];
  // 그림 폴더(art) 안 그림의 크기·자리(힉스필드로 뽑은 그림에 맞춘 값)
  var VART = {
    W: 2048, H: 1360, C: 14,
    bg: { mint: ['room-mint.webp', 377, [2, 6]], pink: ['room-pink.webp', 335, [2, 6]], lavender: ['room-lavender.webp', 365, [2, 5]], plaza: ['room-plaza.webp', 302, []] },
    items: { table: [453.5, 269.1], desk: [292.6, 252.2], chair: [153.6, 172.5], sofa: [321.8, 206.0], shelf: [168.2, 248.4], board: [292.6, 276.1], robot: [139.0, 190.8], plant: [160.9, 185.1],
      lamp: [117.0, 202.0], snack: [190.2, 171.0], cabinet: [168.2, 206.6], cushion: [153.6, 128.7], notice: [277.9, 193.0], clock: [124.3, 125.4], frame: [234.1, 167.4], pennant: [409.6, 132.4] },
    body: { stand: [146, 204], sit: [146, 200] },
    // 마을 지도 집 자리(%) — 왼위 · 왼가운데 · 왼아래 · 오른위 · 오른가운데 · 오른아래, 지붕 색
    slots: [[26.1, 21.5, 'mint'], [18.2, 49.2, 'pink'], [25.6, 77.7, 'lavender'], [74.3, 20.8, 'lavender'], [80.7, 49.9, 'mint'], [73.9, 77.7, 'pink']],
    plaza: [50, 50.5]
  };
  function vdef(k) { k = VITEM_ALIAS[k] || k; var d = VITEMS[k]; return d ? { key: k, label: d[0], w: d[1], h: d[2], kind: d[3], walk: !!d[4], seat: !!d[5], act: d[6], draw: d[7] } : null; }
  function vsvg(k, c, T) { var d = vdef(k), W = d.w * 44, H = d.h * 44 + 30; return d.draw ? '<svg viewBox="0 -30 ' + W + ' ' + H + '" width="' + d.w * T + '" height="' + (d.h * T + 30 * T / 44) + '" aria-hidden="true">' + d.draw(VPAL[c] || VPAL.mint) + '</svg>' : ''; }
  function vday(t) { var d = new Date(t || Date.now()); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function vhash(s) { var h = 5381; String(s).split('').forEach(function (c) { h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; }); return h.toString(36); }
  function vlevel(n) { return Math.min(5, 1 + Math.floor(n / 6)); }

  // 이 브라우저 안에서만 쓰는 연결(저장은 localStorage, 사람은 같은 브라우저의 다른 탭끼리 BroadcastChannel)
  // 홈페이지에선 같은 모양으로 실시간 저장소에 이어 주면 된다.
  function villageLocal(ns) {
    ns = ns || 'qk-village';
    var id = Math.random().toString(36).slice(2, 10), bc = null, others = {}, mine = { lobby: null, room: null, s: null };
    var lobbyFn = null, roomFn = null, subs = {};
    try { bc = root.BroadcastChannel ? new BroadcastChannel(ns) : null; } catch (e) { bc = null; }
    function send() { if (bc) try { bc.postMessage({ id: id, lobby: mine.lobby, room: mine.room, s: mine.s }); } catch (e) {} }
    function notify() {
      var o = Object.keys(others).map(function (k) { return { id: k, r: others[k] }; });
      if (lobbyFn) lobbyFn([{ id: id, me: true, s: mine.lobby }].concat(o.map(function (p) { return { id: p.id, me: false, s: p.r.lobby }; })).filter(function (p) { return p.s; }));
      if (roomFn && mine.room) roomFn([{ id: id, me: true, s: mine.s || {} }].concat(o.filter(function (p) { return p.r.room === mine.room; }).map(function (p) { return { id: p.id, me: false, s: p.r.s || {} }; })));
    }
    if (bc) bc.onmessage = function (e) { var m = e.data || {}; if (!m.id || m.id === id) return; if (m.bye) delete others[m.id]; else { m.t = Date.now(); others[m.id] = m; } notify(); };
    setInterval(function () { send(); var t = Date.now(), ch = false; Object.keys(others).forEach(function (k) { if (t - others[k].t > 7000) { delete others[k]; ch = true; } }); if (ch) notify(); }, 2500);
    root.addEventListener('pagehide', function () { if (bc) try { bc.postMessage({ id: id, bye: true }); } catch (e) {} });
    function key(room, kind) { return ns + ':' + room + (kind ? ':' + kind : ''); }
    function read(k, d) { try { var v = JSON.parse(root.localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
    function write(k, v) { try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} fire(k); }
    function fire(k) { (subs[k] || []).forEach(function (fn) { fn(); }); }
    function sub(k, fn) { (subs[k] = subs[k] || []).push(fn); fn(); return function () { subs[k] = (subs[k] || []).filter(function (f) { return f !== fn; }); }; }
    root.addEventListener('storage', function (e) { if (e.key && subs[e.key]) fire(e.key); });
    return {
      load: function (room) { return Promise.resolve(read(key(room), null)); },
      save: function (room, layout) { write(key(room), layout); return Promise.resolve(); },
      watch: function (room, fn) { var first = true; return sub(key(room), function () { if (first) { first = false; return; } fn(read(key(room), null)); }); },
      list: function (room, kind, fn) { return sub(key(room, kind), function () { fn(read(key(room, kind), [])); }); },
      add: function (room, kind, item) { var a = read(key(room, kind), []).filter(function (x) { return x.id !== item.id; }); a.push(item); write(key(room, kind), a.slice(-300)); return Promise.resolve(); },
      remove: function (room, kind, itemId) { write(key(room, kind), read(key(room, kind), []).filter(function (x) { return x.id !== itemId; })); return Promise.resolve(); },
      doc: function (room, name, fn) { return sub(key(room, 'doc-' + name), function () { fn(read(key(room, 'doc-' + name), null)); }); },
      setDoc: function (room, name, obj) { write(key(room, 'doc-' + name), obj); return Promise.resolve(); },
      lobby: function (fn) { lobbyFn = fn; notify(); return { set: function (st) { mine.lobby = st; send(); notify(); }, stop: function () { lobbyFn = null; mine.lobby = null; send(); } }; },
      join: function (room) {
        mine.room = room; mine.s = {}; send();
        return Promise.resolve({
          watch: function (fn) { roomFn = fn; notify(); return function () { roomFn = null; }; },
          move: function (st) { mine.s = st; send(); notify(); },
          leave: function () { mine.room = null; mine.s = null; roomFn = null; send(); }
        });
      }
    };
  }

  var VBOT = [['보리쌤', 'pom-beanie'], ['민트쌤', 'glasses'], ['새싹쌤', 'headphones']];
  var VBOT_SAY = ['오늘 수업 어땠어요?', '이 자료 같이 봐요!', '다음 모임은 언제 할까요?', '포스트잇 하나 붙였어요', '간식 탁자 최고예요', '저 손 들었어요!'];
  var VACC = [['', '없음'], ['pom-beanie', '방울 털모자'], ['cap', '모자'], ['beret', '베레모'], ['glasses', '안경'], ['headphones', '헤드폰'], ['ribbon', '리본'], ['sprout', '새싹']];
  var NOTE_C = { pink: '#FBD5E2', mint: '#CBEFE4', lavender: '#E3DBFB', white: '#FFFFFF' };
  var faceCache = {};
  function vface(ex, acc) { var k = ex + '|' + acc; return faceCache[k] || (faceCache[k] = Q.url({ expression: ex || 'smile', accessory: acc ? [acc] : [] })); }
  function vmine(id, add) { var m; try { m = JSON.parse(store('qk-village-mine')) || []; } catch (e) { m = []; } if (add) { m.push(id); store('qk-village-mine', JSON.stringify(m.slice(-400))); } return m.indexOf(id) >= 0; }
  function vurl(u) { u = String(u || '').trim(); if (!/^https?:\/\//i.test(u)) u = 'https://' + u; try { var x = new URL(u); return /^https?:$/.test(x.protocol) && x.hostname.indexOf('.') > 0 ? x.href : ''; } catch (e) { return ''; } }

  class QuokaVillage extends Base {
    connectedCallback() { ensureStyle(); if (!this._ready) this.init(); }
    disconnectedCallback() { this._leaveRoom(); this._mapUnsub(); if (this._lob) this._lob.stop(); clearInterval(this._botT); clearInterval(this._clockT); }
    set adapter(a) {
      this._adapter = a; if (!this._ready) return;
      var r = this._view === 'room' ? this._room : null, v = this._view;
      this._leaveRoom(); this._mapUnsub(); this._startLobby();
      if (r) this.enter(r); else if (v === 'map') this.showMap();
    }
    get adapter() { return this._adapter || (this._adapter = villageLocal()); }
    init() {
      var self = this; this._ready = true;
      this.classList.add('qk');
      this._art = this.getAttribute('art'); if (this._art && !/\/$/.test(this._art)) this._art += '/';
      this._rooms = (this.getAttribute('groups') || 'plaza ai-civic physical-ai ai-media ai-sel ai-dev ai-content').split(/\s+/).filter(Boolean);
      this._lobbyList = []; this._counts = {};
      try { this._me = JSON.parse(store('qk-village-me')) || null; } catch (e) { this._me = null; }
      this._box = el('div', 'qk-vil' + (this._art ? ' art' : '')); this.appendChild(this._box);
      this._sheet = document.createElement('quoka-sheet'); this._sheet.setAttribute('mascot', 'happy'); this.appendChild(this._sheet);
      this._startLobby();
      if (this._me) this.showMap(); else this.showSetup();
      this.addEventListener('keydown', function (e) { self._key(e); });
      this._clockT = setInterval(function () { self._tickClock(); }, 1000);
    }
    _info(key) {
      var r = key === 'plaza' ? { key: 'plaza', name: '마을 광장', icon: 'community', tone: 'plaza' } : (function () { var g = findGroup(key); return g ? { key: g.key, name: g.name, icon: g.key, tone: g.tone || 'mint' } : { key: key, name: key, icon: 'home', tone: 'mint' }; })();
      if (this._art && key !== 'plaza') { var i = this._rooms.filter(function (k) { return k !== 'plaza'; }).indexOf(key); if (i >= 0 && VART.slots[i]) r.tone = VART.slots[i][2]; }
      return r;
    }
    _startLobby() {
      var self = this; if (this._lob) this._lob.stop();
      this._lob = this.adapter.lobby(function (list) { self._lobbyList = list; if (self._view === 'map') self._paintCounts(); });
    }
    _lobbySet() { if (this._lob && this._me) this._lob.set({ room: this._room || 'map', n: this._me.name, ac: this._me.acc }); }

    // ── 나 정하기 ──
    showSetup() {
      var self = this, me = this._me || { name: '', group: this._rooms[1] || 'plaza', acc: 'pom-beanie' };
      this._leaveRoom(); this._mapUnsub(); this._view = 'setup';
      var b = this._box; b.innerHTML = '';
      var f = el('form', 'qk-vil-setup');
      f.innerHTML = '<div class="pv"><img alt="" width="104" height="104"></div><div class="fs"><h3>쿼카마을에 들어가기</h3><p>마을에선 닉네임으로 불러요. 실명 대신 「햇살쌤」처럼 적어 주세요.</p>' +
        '<label class="qk-ct-f"><span>닉네임</span><input name="name" maxlength="10" required placeholder="예: 햇살쌤"></label>' +
        '<label class="qk-ct-f"><span>내 분과</span><select name="group"></select></label>' +
        '<fieldset class="qk-ct-topics"><legend>내 쿼카 꾸미기</legend></fieldset>' +
        '<button type="submit" class="qk-ct-go">마을로 가기</button></div>';
      var sel = f.querySelector('select');
      this._rooms.forEach(function (k) { if (k === 'plaza') return; var o = document.createElement('option'); o.value = k; o.textContent = self._info(k).name; sel.appendChild(o); });
      var none = document.createElement('option'); none.value = 'plaza'; none.textContent = '아직 정하지 않았어요'; sel.appendChild(none);
      sel.value = me.group; f.elements.name.value = me.name || '';
      var fs = f.querySelector('fieldset'), pv = f.querySelector('.pv img');
      VACC.forEach(function (a) { fs.insertAdjacentHTML('beforeend', '<label><input type="radio" name="acc" value="' + a[0] + '"' + (a[0] === (me.acc || '') ? ' checked' : '') + '><span>' + a[1] + '</span></label>'); });
      var upd = function () { var c = f.querySelector('[name=acc]:checked'); pv.src = vface('happy', c ? c.value : ''); };
      f.addEventListener('change', upd); upd();
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var n = f.elements.name.value.trim().slice(0, 10); if (!n) { f.elements.name.focus(); return; }
        var c = f.querySelector('[name=acc]:checked');
        self._me = { name: n, group: sel.value, acc: c ? c.value : '' };
        store('qk-village-me', JSON.stringify(self._me));
        self.showMap();
      });
      b.appendChild(f);
    }

    // ── 마을 지도 ──
    showMap() {
      var self = this; this._leaveRoom(); this._mapUnsub(); this._view = 'map'; this._room = null; this._lobbySet();
      var b = this._box; b.innerHTML = '';
      var top = el('div', 'qk-vil-top');
      top.innerHTML = '<div><b>쿼카마을</b><small class="tot">분과 집에 들어가 함께 꾸미고 모여요</small></div>';
      var meb = el('button', 'qk-vil-me', '<img alt="" width="30" height="30" src="' + vface('smile', this._me.acc) + '"><span></span><i>바꾸기</i>');
      meb.type = 'button'; meb.querySelector('span').textContent = this._me.name;
      meb.addEventListener('click', function () { self.showSetup(); });
      top.appendChild(meb); b.appendChild(top);
      var map = el('div', this._art ? 'qk-vil-world' : 'qk-vil-map');
      if (this._art) map.style.backgroundImage = 'url("' + this._art + 'map.webp")';
      var slot = 0;
      this._rooms.forEach(function (k) {
        var r = self._info(k), mine = self._me.group === k, pos = k === 'plaza' ? VART.plaza : VART.slots[slot++];
        var h = el('button', 'qk-vil-house' + (k === 'plaza' ? ' plaza' : ''));
        h.type = 'button'; h.dataset.room = k; h.setAttribute('aria-label', r.name + ' 들어가기');
        if (self._art) {
          if (!pos) return;
          h.style.left = pos[0] + '%'; h.style.top = pos[1] + '%';
          if (mine) h.classList.add('is-mine');
          h.innerHTML = '<span class="glow" aria-hidden="true"></span><span class="spk" aria-hidden="true"></span><span class="qv-tg"><span class="ic">' + icon(r.icon, 22) + '</span><b></b><span class="lv" aria-hidden="true"></span><span class="cnt"><i class="faces"></i><em></em></span></span>' + (mine ? '<span class="mine">내 분과</span>' : '');
        } else {
          var P = VPAL[r.tone] || VPAL.lavender;
          h.innerHTML = '<svg viewBox="0 0 120 92" aria-hidden="true"><path d="M10 44 60 8l50 36" fill="' + P[0] + '" stroke="' + P[0] + '" stroke-width="10" stroke-linejoin="round"/>' + vr(20, 42, 80, 46, 8, P[1]) + vr(50, 58, 20, 30, 6, P[2]) + '</svg>' +
            '<span class="qv-tg"><span class="ic">' + icon(r.icon, 22) + '</span><b></b><span class="lv" aria-hidden="true"></span><span class="cnt"><i class="faces"></i><em></em></span></span>' + (mine ? '<span class="mine">내 분과</span>' : '');
        }
        h.querySelector('b').textContent = k === 'plaza' ? '마을 광장' : r.name.replace(/ 분과$/, '');
        h.addEventListener('click', function () { self.enter(k); });
        map.appendChild(h);
      });
      if (this._art) { // 좁은 화면에선 지도를 옆으로 밀어 봐요(처음엔 광장이 가운데)
        var ws = el('div', 'qk-vil-wscroll'); ws.appendChild(map); b.appendChild(ws);
        requestAnimationFrame(function () { ws.scrollLeft = Math.max(0, (ws.scrollWidth - ws.clientWidth) / 2); });
      } else b.appendChild(map);
      var hint = el('p', 'qk-vil-hint', (this._art ? '<span class="sw-only">지도를 옆으로 밀어 봐요 · </span>' : '') + '집을 눌러 들어가요 · 포스트잇 · 자료 · 출석 도장이 쌓이면 집이 반짝이며 레벨업해요');
      b.appendChild(hint);
      this._paintCounts();
      // 집마다 활동 수(레벨)
      var A = this.adapter;
      if (A.list) this._rooms.forEach(function (k) {
        ['notes', 'links', 'stamps'].forEach(function (kind) {
          var off = A.list(k, kind, function (arr) { (self._counts[k] = self._counts[k] || {})[kind] = (arr || []).length; if (self._view === 'map') self._paintCounts(); });
          if (typeof off === 'function') (self._mapOffs = self._mapOffs || []).push(off);
        });
      });
    }
    _mapUnsub() { (this._mapOffs || []).forEach(function (f) { try { f(); } catch (e) {} }); this._mapOffs = []; }
    _actCount(k) { var c = this._counts[k] || {}; return (c.notes || 0) + (c.links || 0) * 2 + (c.stamps || 0); }
    _paintCounts() {
      var self = this, by = {}, total = 0;
      this._lobbyList.forEach(function (p) { if (p.s && p.s.room) (by[p.s.room] = by[p.s.room] || []).push(p); });
      Array.prototype.forEach.call(this._box.querySelectorAll('.qk-vil-house'), function (h) {
        var k = h.dataset.room, ps = by[k] || [], c = h.querySelector('.cnt'), n = self._actCount(k), lv = vlevel(n);
        total += n;
        h.classList.toggle('on', ps.length > 0);
        h.dataset.lv = lv;
        c.querySelector('em').textContent = ps.length ? ps.length + '명' : '';
        c.querySelector('.faces').innerHTML = ps.slice(0, 3).map(function (p) { return '<img alt="" width="20" height="20" src="' + vface('smile', p.s.ac) + '">'; }).join('');
        var L = h.querySelector('.lv'); L.textContent = 'Lv.' + lv; L.title = '활동 ' + n;
        var sp = h.querySelector('.spk'); if (sp && sp.children.length !== lv - 1) sp.innerHTML = new Array(lv).join('<i></i>');
        h.setAttribute('aria-label', h.querySelector('b').textContent + ' 들어가기 · 레벨 ' + lv + (ps.length ? ' · ' + ps.length + '명 있음' : ''));
      });
      var tot = this._box.querySelector('.tot'); if (tot) tot.textContent = total ? '마을에 쌓인 활동 ' + total + ' · 지금 ' + this._lobbyList.filter(function (p) { return p.s && p.s.room !== 'map'; }).length + '명이 집 안에 있어요' : '분과 집에 들어가 함께 꾸미고 모여요';
    }

    // ── 방 ──
    _geo(L) {
      if (!this._art) return { T: 44, Th: 44, C: 14, R: 9, wall: 88, W: 616, H: 484 };
      var bg = VART.bg[(this._room === 'plaza') ? 'plaza' : (L && VART.bg[L.wall] && L.wall !== 'plaza' ? L.wall : this._info(this._room).tone)] || VART.bg.mint;
      var T = VART.W / VART.C;
      return { T: T, Th: (VART.H - bg[1]) / 7, C: VART.C, R: 7, wall: bg[1], W: VART.W, H: VART.H, img: bg[0], win: bg[2] };
    }
    _defLayout(key) {
      var t = this._info(key).tone, o = t === 'pink' ? 'mint' : 'pink', it = [], art = !!this._art;
      function a(k, x, y, c) { it.push({ id: k + it.length, k: k, x: x, y: y, c: c || t }); }
      if (art) {
        a('rug', 4, 2, t === 'plaza' ? 'lavender' : t); a('table', 5, 2); a('chair', 4, 2); a('chair', 4, 3); a('chair', 8, 2); a('chair', 8, 3); a('chair', 6, 4);
        a('shelf', 0, 0); a('plant', 1, 0); a('board', 11, 0); a('lamp', 13, 0); a('sofa', 11, 5); a('cushion', 1, 5); a('cushion', 2, 5); a('plant', 13, 6); a('snack', 0, 6);
        if (key === 'plaza') { a('pennant', 1, 0); a('pennant', 5, 0); a('pennant', 9, 0); a('snack', 10, 3); }
        else { a('frame', 7, 0); a('clock', 9, 0); }
        if (key === 'physical-ai') { a('robot', 10, 3); a('robot', 12, 3); }
        else if (key === 'ai-dev') { a('desk', 1, 3); a('desk', 11, 3); }
        else if (key === 'ai-media' || key === 'ai-content') { a('board', 1, 3); a('cabinet', 12, 3); }
        else if (key === 'ai-sel') { a('cushion', 11, 3); a('cushion', 12, 3); a('plant', 10, 3); }
        else if (key === 'ai-civic') { a('cabinet', 12, 3); a('desk', 1, 3); }
        return { v: 2, art: 1, wall: t, notice: '', items: it };
      }
      a('rug', 4, 3, t); a('table', 5, 3, 'white'); a('chair', 4, 3, o); a('chair', 4, 4, o); a('chair', 8, 3, o); a('chair', 8, 4, o); a('chair', 6, 5, o);
      a('shelf', 0, 0, 'white'); a('plant', 1, 0, o); a('board', 11, 0, t); a('lamp', 13, 0, t); a('sofa', 11, 7, t); a('cushion', 1, 7, o); a('plant', 13, 8, t); a('snack', 0, 8, 'white');
      a('frame', 2, 0, o); a('clock', 5, 0, t); a('notice', 7, 0, t);
      return { v: 2, wall: t, floor: t, notice: '', items: it };
    }
    enter(key) {
      var self = this; this._leaveRoom(); this._mapUnsub();
      this._view = 'room'; this._room = key; this._editing = false; this._sel = null; this._pick = null;
      this._peers = {}; this._expr = 'smile'; this._hand = false; this._say = null; this._call = null; this._data = { notes: [], links: [], stamps: [], meet: null };
      var info = this._info(key), b = this._box; b.innerHTML = '';
      var bar = el('div', 'qk-vil-bar');
      bar.innerHTML = '<button type="button" class="back" aria-label="마을로">' + ARROW_L + '<span>마을</span></button><span class="ttl">' + icon(info.icon, 26) + '<b></b></span><span class="ntc"></span>' +
        '<span class="sp"></span><span class="pc"></span><button type="button" class="qk-gbtn call">모여요</button><button type="button" class="qk-gbtn deco">꾸미기</button>';
      bar.querySelector('b').textContent = info.name;
      b.appendChild(bar);
      var wrap = el('div', 'qk-vil-room'), stage = el('div', 'qk-vil-stage'), scene = el('div', 'qk-vil-scene');
      scene.innerHTML = '<div class="bg"></div><div class="items"></div><div class="avs"></div><div class="tags"></div><div class="ghost" hidden></div>';
      stage.appendChild(scene); stage.tabIndex = 0;
      stage.setAttribute('role', 'application'); stage.setAttribute('aria-label', info.name + ' — 칸을 누르거나 방향키로 움직여요. 화이트보드·회의 탁자·책장을 누르면 열려요');
      var side = el('div', 'qk-vil-side');
      side.innerHTML = '<div class="acts"><button type="button" data-act="notes"><b>포스트잇</b><span>0</span></button><button type="button" data-act="meet"><b>모임</b><span>도장 0</span></button><button type="button" data-act="links"><b>자료</b><span>0</span></button></div>' +
        '<p class="h">함께 있는 사람</p><ul class="ppl"></ul><p class="h">이야기</p><ol class="log" aria-live="polite"></ol>';
      wrap.appendChild(stage); wrap.appendChild(side); b.appendChild(wrap);
      var dock = el('div', 'qk-vil-dock');
      dock.innerHTML = '<form class="chat"><input maxlength="80" placeholder="말 걸기 (Enter)" aria-label="채팅"><button type="submit" class="qk-gbtn">보내기</button></form>' +
        '<div class="emo">' + EMOTES.map(function (e) { return '<button type="button" data-ex="' + e[0] + '" title="' + e[1] + '" aria-label="표정 ' + e[1] + '"><img alt="" width="30" height="30" src="' + vface(e[0], '') + '"></button>'; }).join('') + '</div>' +
        '<button type="button" class="qk-gbtn hand" aria-pressed="false">손 들기</button>';
      b.appendChild(dock);
      var deco = el('div', 'qk-vil-deco'); deco.hidden = true; b.appendChild(deco);
      this._els = { bar: bar, stage: stage, scene: scene, bg: scene.querySelector('.bg'), items: scene.querySelector('.items'), avs: scene.querySelector('.avs'), tags: scene.querySelector('.tags'), ghost: scene.querySelector('.ghost'),
        ppl: side.querySelector('.ppl'), log: side.querySelector('.log'), acts: side.querySelector('.acts'), dock: dock, deco: deco, ntc: bar.querySelector('.ntc'), pc: bar.querySelector('.pc') };
      bar.querySelector('.back').addEventListener('click', function () { self.showMap(); });
      bar.querySelector('.deco').addEventListener('click', function () { self.decorate(!self._editing); });
      bar.querySelector('.call').addEventListener('click', function () { self._gather(); });
      Array.prototype.forEach.call(side.querySelectorAll('[data-act]'), function (x) { x.addEventListener('click', function () { self.open(x.dataset.act); }); });
      dock.querySelector('.chat').addEventListener('submit', function (e) { e.preventDefault(); var i = this.querySelector('input'); self.say(i.value); i.value = ''; });
      Array.prototype.forEach.call(dock.querySelectorAll('[data-ex]'), function (x) { x.addEventListener('click', function () { self.emote(x.dataset.ex); }); });
      dock.querySelector('.hand').addEventListener('click', function () { self._hand = !self._hand; this.setAttribute('aria-pressed', String(self._hand)); this.textContent = self._hand ? '손 내리기' : '손 들기'; self._push(); });
      scene.addEventListener('pointerdown', function (e) { self._down(e); });
      scene.addEventListener('pointermove', function (e) { self._hover(e); });
      scene.addEventListener('pointerup', function (e) { self._up(e); });
      scene.addEventListener('pointerleave', function () { if (!self._drag) self._els.ghost.hidden = true; });
      this._ro = root.ResizeObserver ? new ResizeObserver(function () { self._fit(); }) : null;
      if (this._ro) this._ro.observe(stage); else root.addEventListener('resize', this._fitFn = function () { self._fit(); });
      this._layout = this._defLayout(key); this._applyGeo(); this._paintRoom(); this._fit();
      var A = this.adapter, gen = this._gen = (this._gen || 0) + 1, offs = this._roomOffs = [];
      Promise.resolve(A.load(key)).then(function (l) { if (gen !== self._gen) return; if (l && l.items) { self._layout = self._fixLayout(l); self._applyGeo(); self._paintRoom(); } self._spawn(); }, function () { self._spawn(); });
      if (A.watch) offs.push(A.watch(key, function (l) { if (gen !== self._gen || !l || !l.items || self._dragging) return; self._layout = self._fixLayout(l); self._applyGeo(); self._paintRoom(); }));
      if (A.list) ['notes', 'links', 'stamps'].forEach(function (kind) {
        var first = true;
        offs.push(A.list(key, kind, function (arr) {
          if (gen !== self._gen) return;
          var prev = self._data[kind].length; self._data[kind] = (arr || []).slice();
          if (!first && self._data[kind].length > prev) { var last = self._data[kind][self._data[kind].length - 1]; if (last && !vmine(last.id)) self._actToast(kind, last); }
          first = false; self._paintActs();
        }));
      });
      if (A.doc) offs.push(A.doc(key, 'meet', function (m) { if (gen !== self._gen) return; self._data.meet = m; self._paintActs(); }));
      Promise.resolve(A.join(key)).then(function (r) {
        if (gen !== self._gen) { if (r && r.leave) r.leave(); return; }
        self._rt = r; self._unpeers = r.watch(function (list) { self._peersIn(list); }); self._push();
      }, function () {});
      this._lobbySet();
      if (this._bots) this._botsStart();
      this.dispatchEvent(new CustomEvent('enter', { detail: { room: key }, bubbles: true }));
    }
    _fixLayout(l) { // 다른 그림 방식(납작/그림)으로 저장된 방은 처음 모습으로, 칸 밖 가구는 뺀다
      if (!l || !l.items || !!l.art !== !!this._art) return this._defLayout(this._room);
      l = JSON.parse(JSON.stringify(l));
      var C = 14, R = this._art ? 7 : 9;
      l.items = l.items.filter(function (it) { var d = vdef(it.k); return d && it.x >= 0 && it.x + d.w <= C && (d.kind === 'w' || (it.y >= 0 && it.y + d.h <= R)); }).map(function (it) { it.k = vdef(it.k).key; return it; });
      return l;
    }
    _leaveRoom() {
      if (this._view !== 'room') return;
      this._gen = (this._gen || 0) + 1;
      (this._roomOffs || []).forEach(function (f) { if (typeof f === 'function') try { f(); } catch (e) {} }); this._roomOffs = [];
      if (this._unpeers) { this._unpeers(); this._unpeers = null; }
      if (this._rt) { try { this._rt.leave(); } catch (e) {} this._rt = null; }
      if (this._ro) { this._ro.disconnect(); this._ro = null; } if (this._fitFn) { root.removeEventListener('resize', this._fitFn); this._fitFn = null; }
      clearTimeout(this._walkT); clearTimeout(this._saveT); clearInterval(this._botT); this._botT = 0; this._botsOn = false;
      if (this._pendingSave) this._flushSave();
      if (this._sheet && this._sheet.close) this._sheet.close();
      this._view = null;
      this.dispatchEvent(new CustomEvent('leave', { bubbles: true }));
    }
    _applyGeo() {
      var G = this._g = this._geo(this._layout), E = this._els; if (!E) return;
      E.scene.style.width = G.W + 'px'; E.scene.style.height = G.H + 'px';
      if (this._art) E.bg.style.cssText = 'background-image:url("' + this._art + G.img + '")';
      else {
        var L = this._layout, Wc = VWALLC[L.wall] || VWALLC.mint, F = VFLOOR[L.floor || L.wall] || VFLOOR.mint;
        E.bg.style.cssText = 'background:linear-gradient(' + Wc[0] + ' ' + (G.wall - 8) + 'px,' + Wc[1] + ' ' + (G.wall - 8) + 'px,' + Wc[1] + ' ' + G.wall + 'px,transparent ' + G.wall + 'px),' +
          'linear-gradient(' + F[1] + ' 1.5px,transparent 1.5px) 0 ' + G.wall + 'px/' + G.T + 'px ' + G.T + 'px,linear-gradient(90deg,' + F[1] + ' 1.5px,transparent 1.5px) 0 ' + G.wall + 'px/' + G.T + 'px ' + G.T + 'px,' + F[0];
      }
      this._fit();
    }
    _fit() {
      var E = this._els, G = this._g; if (!E || !G) return;
      var w = E.stage.clientWidth || G.W, s = this._art ? Math.max(w < 560 ? 0.27 : 0.4, Math.min(0.75, w / G.W)) : Math.max(0.74, Math.min(1.5, w / G.W));
      this._scale = s; this._stageW = w;
      E.scene.style.setProperty('--k', (1 / s).toFixed(3));
      E.stage.style.height = Math.round(G.H * s) + 'px';
      this._camera();
    }
    _camera() {
      var E = this._els, G = this._g; if (!E || !G) return;
      var s = this._scale || 1, full = G.W * s, w = this._stageW || full, me = this._mePos || { x: G.C / 2 };
      var off = full > w ? Math.max(0, Math.min(full - w, (me.x + 0.5) * G.T * s - w / 2)) : -Math.max(0, (w - full) / 2);
      E.scene.style.transform = 'translateX(' + (-off) + 'px) scale(' + s + ')';
    }
    _grid() {
      var G = this._g, g = [], x, y;
      for (y = 0; y < G.R; y++) { g.push([]); for (x = 0; x < G.C; x++) g[y].push(0); }
      (this._layout.items || []).forEach(function (it) {
        var d = vdef(it.k); if (!d || d.kind === 'w') return;
        for (y = it.y; y < it.y + d.h; y++) for (x = it.x; x < it.x + d.w; x++) if (g[y] && g[y][x] !== undefined) { if (d.kind === 'r') continue; g[y][x] = d.walk ? (d.seat ? 2 : 0) : 1; }
      });
      return g;
    }
    _itemBox(it) { // 장면 안 그림 자리(왼쪽 · 위 · 너비 · 높이)
      var G = this._g, d = vdef(it.k), T = G.T, Th = G.Th;
      if (d.kind === 'r') return { l: it.x * T + T * 0.08, t: G.wall + it.y * Th + Th * 0.12, w: d.w * T - T * 0.16, h: d.h * Th - Th * 0.2 };
      if (this._art) {
        var a = VART.items[d.key], u = T / 146.3, w = a[0] * u, h = a[1] * u;
        if (d.kind === 'w') return { l: it.x * T + (d.w * T - w) / 2, t: d.key === 'pennant' ? G.wall * 0.1 : (G.wall - h) * 0.42, w: w, h: h };
        return { l: it.x * T + (d.w * T - w) / 2, t: G.wall + (it.y + d.h) * Th - h - Th * 0.06, w: w, h: h };
      }
      var hh = d.h * T + 30 * T / 44;
      return { l: it.x * T, t: d.kind === 'w' ? 12 : G.wall + (it.y + d.h) * T - hh, w: d.w * T, h: hh };
    }
    _itemHTML(it) {
      var d = vdef(it.k);
      if (d.kind === 'r') { var P = VPAL[it.c] || VPAL.lavender; return '<span class="rug" style="background:' + P[1] + ';border-color:' + P[0] + '"></span>'; }
      if (this._art) return '<img alt="" draggable="false" src="' + this._art + 'items/' + d.key + '.webp">';
      return vsvg(d.key, it.c, this._g.T);
    }
    _paintRoom() {
      var self = this, L = this._layout, E = this._els, G = this._g; if (!E) return;
      E.ntc.textContent = L.notice || '';
      E.items.innerHTML = '';
      (L.items || []).forEach(function (it) {
        var d = vdef(it.k); if (!d) return;
        var bx = self._itemBox(it), n = el('div', 'qk-vil-item' + (self._sel === it.id ? ' sel' : '') + (d.act ? ' act' : ''), self._itemHTML(it));
        n.dataset.id = it.id;
        n.style.cssText = 'left:' + bx.l + 'px;top:' + bx.t + 'px;width:' + bx.w + 'px;height:' + bx.h + 'px;z-index:' + (d.kind === 'r' ? 1 : d.kind === 'w' ? 2 : (it.y + d.h) * 10 + 4);
        E.items.appendChild(n);
      });
      this._paintTags();
      if (this._mePos) { var g = this._grid(); if (!g[this._mePos.y] || g[this._mePos.y][this._mePos.x] === 1) this._spawn(); else this._drawMe(); }
    }
    _paintTags() { // 하는 일이 있는 가구 위 이름표(포스트잇 7 · 모임 중 · 자료 3)
      var self = this, E = this._els; if (!E) return;
      E.tags.innerHTML = '';
      if (this._editing) return;
      var seen = {};
      (this._layout.items || []).forEach(function (it) {
        var d = vdef(it.k); if (!d || !d.act || seen[d.act + it.id]) return;
        var bx = self._itemBox(it), t = el('button', 'qk-vil-tag qv-t-' + d.act); t.type = 'button';
        t.textContent = self._tagText(d.act);
        if (d.act === 'meet' && self._meetLeft() > 0) t.classList.add('live');
        t.style.top = Math.max(4, bx.t - 6) + 'px';
        t.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
        t.addEventListener('click', function () { self.open(d.act); });
        E.tags.appendChild(t);
        var tw = t.offsetWidth || 0, G = self._g; // 방 가장자리에서 잘리지 않게
        t.style.left = Math.max(tw / 2 + 6, Math.min(G.W - tw / 2 - 6, bx.l + bx.w / 2)) + 'px';
      });
    }
    _meetLeft() { var m = this._data && this._data.meet; return m && m.ends ? Math.max(0, m.ends - Date.now()) : 0; }
    _todayStamps() { var d = vday(); return (this._data.stamps || []).filter(function (s) { return s.d === d; }); }
    _tagText(act) {
      var D = this._data || {};
      if (act === 'notes') return '포스트잇 ' + (D.notes || []).length;
      if (act === 'links') return '자료 ' + (D.links || []).length;
      var left = this._meetLeft();
      return left > 0 ? '모임 중 · ' + Math.ceil(left / 60000) + '분 남음' : (this._todayStamps().length ? '오늘 도장 ' + this._todayStamps().length : '모임 열기');
    }
    _paintActs() {
      var E = this._els, D = this._data; if (!E) return;
      var bs = E.acts.querySelectorAll('[data-act]');
      bs[0].querySelector('span').textContent = (D.notes || []).length;
      bs[1].querySelector('span').textContent = this._meetLeft() > 0 ? Math.ceil(this._meetLeft() / 60000) + '분' : '도장 ' + this._todayStamps().length;
      bs[2].querySelector('span').textContent = (D.links || []).length;
      bs[1].classList.toggle('live', this._meetLeft() > 0);
      this._paintTags();
      if (this._openAct) this._renderAct(this._openAct);
    }
    _tickClock() {
      if (this._view !== 'room' || !this._data || !this._data.meet || !this._data.meet.ends) return;
      var left = this._meetLeft();
      if (left <= 0 && !this._meetDone) { this._meetDone = true; toast('모임 시간이 끝났어요. 수고했어요!', { mood: 'happy' }); this._paintActs(); }
      if (left > 0) { this._meetDone = false; if (Math.floor(left / 1000) % 15 === 0) this._paintActs(); var tm = this._sheet.querySelector('.qv-timer b'); if (tm) tm.textContent = Math.floor(left / 60000) + ':' + ('0' + Math.floor(left / 1000) % 60).slice(-2); }
    }
    _actToast(kind, item) {
      var who = String(item.n || '누군가').slice(0, 10);
      var msg = kind === 'notes' ? who + '님이 포스트잇을 붙였어요' : kind === 'links' ? who + '님이 자료를 꽂았어요' : who + '님이 출석 도장을 찍었어요';
      var self = this; toast(msg, { mood: 'happy', time: 3000, action: kind === 'stamps' ? null : { label: '보기', onClick: function () { self.open(kind); } } });
      this.dispatchEvent(new CustomEvent('activity', { detail: { kind: kind, room: this._room }, bubbles: true }));
    }

    // ── 하는 일: 포스트잇 · 모임 · 자료 ──
    open(act) {
      var title = { notes: '포스트잇 보드', meet: '모임 탁자', links: '자료 책장' }[act]; if (!title) return;
      this._openAct = act;
      this._sheet.setAttribute('heading', this._info(this._room).name.replace(/ 분과$/, '') + ' · ' + title);
      this._sheet.setAttribute('mascot', act === 'notes' ? 'idea' : act === 'meet' ? 'excited' : 'happy');
      this._renderAct(act, true);
      var self = this;
      if (!this._sheetHooked) { this._sheetHooked = true; this._sheet.addEventListener('close', function () { self._openAct = null; }); }
      this._sheet.show();
    }
    _renderAct(act, fresh) {
      var self = this, S = this._sheet, body = S.querySelector('.qk-sheet-body'); if (!body) return;
      var D = this._data, A = this.adapter, room = this._room, me = this._me;
      if (!fresh) { // 쓰고 있던 글은 지우지 않는다
        var typing = Array.prototype.some.call(body.querySelectorAll('input,textarea'), function (i) { return i.value || i === document.activeElement; });
        if (act !== 'meet' || typing) { this._renderList(act, body); return; }
      }
      body.innerHTML = '';
      var wrap = el('div', 'qv-act qv-a-' + act);
      if (act === 'notes') {
        wrap.innerHTML = '<form class="qv-form"><textarea maxlength="100" rows="3" placeholder="수업 아이디어, 궁금한 점, 응원 한마디…" aria-label="포스트잇 내용"></textarea>' +
          '<div class="row"><span class="cs"></span><button type="submit" class="qk-cta">붙이기</button></div></form><div class="qv-list qv-l-notes"></div>';
        var cs = wrap.querySelector('.cs'), pickC = this._noteC || 'pink';
        Object.keys(NOTE_C).forEach(function (c) { var b = el('button', 'qk-vil-sw'); b.type = 'button'; b.style.background = NOTE_C[c]; b.setAttribute('aria-label', VCOL[c] || c); b.setAttribute('aria-pressed', String(c === pickC)); b.addEventListener('click', function () { self._noteC = pickC = c; Array.prototype.forEach.call(cs.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }); cs.appendChild(b); });
        wrap.querySelector('form').addEventListener('submit', function (e) {
          e.preventDefault(); var ta = this.querySelector('textarea'), t = ta.value.trim().slice(0, 100); if (!t) return;
          var it = { id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), t: t, c: pickC, n: me.name, ac: me.acc, at: Date.now() };
          vmine(it.id, true); ta.value = '';
          Promise.resolve(A.add(room, 'notes', it)).then(function () { toast('포스트잇을 붙였어요', { mood: 'happy', time: 1600 }); }, function () { toast('붙이지 못했어요', { mood: 'error' }); });
        });
      } else if (act === 'links') {
        wrap.innerHTML = '<form class="qv-form"><input name="t" maxlength="40" placeholder="자료 이름 (예: 6학년 AI 윤리 수업안)" aria-label="자료 이름"><input name="u" maxlength="300" placeholder="주소 (https://…)" aria-label="자료 주소" inputmode="url">' +
          '<div class="row"><small>링크만 꽂아요. 파일은 드라이브·패들렛 등에 올리고 주소를 넣어 주세요.</small><button type="submit" class="qk-cta">꽂기</button></div></form><div class="qv-list qv-l-links"></div>';
        wrap.querySelector('form').addEventListener('submit', function (e) {
          e.preventDefault(); var t = this.elements.t.value.trim().slice(0, 40), u = vurl(this.elements.u.value);
          if (!t || !u) { toast(!t ? '자료 이름을 적어 주세요' : '주소를 다시 확인해 주세요', { mood: 'worried' }); return; }
          var it = { id: 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), t: t, u: u, n: me.name, ac: me.acc, at: Date.now() };
          vmine(it.id, true); this.reset();
          Promise.resolve(A.add(room, 'links', it)).then(function () { toast('책장에 꽂았어요', { mood: 'happy', time: 1600 }); }, function () { toast('꽂지 못했어요', { mood: 'error' }); });
        });
      } else {
        var m = D.meet || {}, left = this._meetLeft();
        wrap.innerHTML = '<div class="qv-topic"><small>오늘 모임 주제</small><b></b></div>' +
          '<form class="qv-form inline"><input maxlength="40" placeholder="주제 적기 (예: 학교자율시간 AI 수업 나눔)" aria-label="모임 주제"><button type="submit" class="qk-gbtn">정하기</button></form>' +
          '<div class="qv-timer"><span>타이머</span>' + (left > 0 ? '<b>' + Math.floor(left / 60000) + ':' + ('0' + Math.floor(left / 1000) % 60).slice(-2) + '</b><button type="button" class="qk-gbtn" data-t="0">끝내기</button>' : '<button type="button" class="qk-gbtn" data-t="10">10분</button><button type="button" class="qk-gbtn" data-t="20">20분</button><button type="button" class="qk-gbtn" data-t="30">30분</button><button type="button" class="qk-gbtn" data-t="50">50분</button>') + '</div>' +
          '<div class="qv-stamp"><button type="button" class="qk-cta stamp">출석 도장 찍기</button><small></small></div><div class="qv-list qv-l-stamps"></div>';
        wrap.querySelector('.qv-topic b').textContent = m.topic || '아직 정하지 않았어요';
        var fm = wrap.querySelector('form');
        fm.addEventListener('submit', function (e) { e.preventDefault(); var t = this.querySelector('input').value.trim().slice(0, 40); if (!t) return; var nm = Object.assign({}, D.meet || {}, { topic: t, by: me.name, at: Date.now() }); A.setDoc(room, 'meet', nm); this.reset(); toast('주제를 정했어요', { mood: 'happy', time: 1500 }); });
        Array.prototype.forEach.call(wrap.querySelectorAll('[data-t]'), function (b) { b.addEventListener('click', function () { var min = +b.dataset.t; var nm = Object.assign({}, D.meet || {}, { ends: min ? Date.now() + min * 60000 : 0, by: me.name }); self._meetDone = false; A.setDoc(room, 'meet', nm); if (min) self.say(min + '분 타이머를 켰어요 ⏱'); }); });
        var st = wrap.querySelector('.stamp'), did = this._todayStamps().some(function (s) { return s.n === me.name; });
        st.disabled = did; st.textContent = did ? '오늘 도장 찍었어요' : '출석 도장 찍기';
        st.addEventListener('click', function () {
          var it = { id: vday() + '-' + vhash(me.name), d: vday(), n: me.name, ac: me.acc, at: Date.now() };
          vmine(it.id, true); st.disabled = true;
          Promise.resolve(A.add(room, 'stamps', it)).then(function () { toast('도장 쾅! 오늘도 함께해 줘서 고마워요', { mood: 'excited' }); self.emote('excited'); });
        });
      }
      body.appendChild(wrap);
      this._renderList(act, body);
    }
    _renderList(act, body) {
      var self = this, D = this._data, A = this.adapter, room = this._room, box = body.querySelector('.qv-list'); if (!box) return;
      box.innerHTML = '';
      if (act === 'notes') {
        var ns = (D.notes || []).slice().sort(function (a, b) { return b.at - a.at; }).slice(0, 60);
        if (!ns.length) box.innerHTML = '<p class="empty">아직 포스트잇이 없어요. 첫 장을 붙여 주세요!</p>';
        ns.forEach(function (n) {
          var c = el('div', 'qv-note', '<p></p><small><img alt="" width="18" height="18" src="' + vface('smile', n.ac || '') + '"><span></span></small>');
          c.style.background = NOTE_C[n.c] || NOTE_C.pink; c.style.setProperty('--r', ((vhash(n.id).charCodeAt(0) % 5) - 2) * 0.8 + 'deg');
          c.querySelector('p').textContent = String(n.t || '').slice(0, 100);
          c.querySelector('span').textContent = String(n.n || '').slice(0, 10) + ' · ' + relDay(vday(n.at), parseDay(new Date()));
          if (vmine(n.id)) { var x = el('button', 'x', '&times;'); x.type = 'button'; x.setAttribute('aria-label', '떼기'); x.addEventListener('click', function () { A.remove(room, 'notes', n.id); }); c.appendChild(x); }
          box.appendChild(c);
        });
      } else if (act === 'links') {
        var ls = (D.links || []).slice().sort(function (a, b) { return b.at - a.at; });
        if (!ls.length) box.innerHTML = '<p class="empty">아직 꽂힌 자료가 없어요.</p>';
        ls.forEach(function (l) {
          var u = vurl(l.u); if (!u) return;
          var r = el('div', 'qv-link', '<span class="sp" aria-hidden="true"></span><a target="_blank" rel="noopener noreferrer"></a><small></small>');
          var a = r.querySelector('a'); a.href = u; a.textContent = String(l.t || u).slice(0, 40);
          var host = ''; try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (e) {}
          r.querySelector('small').textContent = host + ' · ' + String(l.n || '').slice(0, 10) + ' · ' + relDay(vday(l.at), parseDay(new Date()));
          if (vmine(l.id)) { var x = el('button', 'x', '&times;'); x.type = 'button'; x.setAttribute('aria-label', '빼기'); x.addEventListener('click', function () { A.remove(room, 'links', l.id); }); r.appendChild(x); }
          box.appendChild(r);
        });
      } else {
        var today = this._todayStamps(), all = (D.stamps || []).length;
        var sm = body.querySelector('.qv-stamp small'); if (sm) sm.textContent = '오늘 ' + today.length + '명 · 지금까지 도장 ' + all + '개';
        if (!today.length) box.innerHTML = '<p class="empty">오늘 찍은 도장이 아직 없어요.</p>';
        today.forEach(function (s) { var c = el('div', 'qv-stamp-i', '<img alt="" width="40" height="40" src="' + vface('happy', s.ac || '') + '"><span></span>'); c.querySelector('span').textContent = String(s.n || '').slice(0, 10); box.appendChild(c); });
        var tb = body.querySelector('.qv-topic b'); if (tb) tb.textContent = (D.meet && D.meet.topic) || '아직 정하지 않았어요';
      }
    }

    // ── 사람 ──
    _spawn() { // 문 앞 칸 몇 군데 중 비어 있는 곳에 무작위로(같이 들어온 사람과 겹치지 않게)
      var self = this, g = this._grid(), G = this._g, taken = {}, free = [], p = null;
      Object.keys(this._peers || {}).forEach(function (k) { var s = self._peers[k]; taken[s.x + ',' + s.y] = 1; });
      [[6, 1], [7, 1], [5, 1], [8, 1], [4, 1], [9, 1], [6, 2], [7, 2], [3, 2], [10, 2]].forEach(function (c) { var x = c[0], y = G.R - c[1]; if (g[y] && g[y][x] !== 1 && !taken[x + ',' + y]) free.push({ x: x, y: y }); });
      if (free.length) p = free[Math.floor(Math.random() * Math.min(free.length, 6))];
      if (!p) for (var y = G.R - 1; y >= 0 && !p; y--) for (var x = 0; x < G.C && !p; x++) if (g[y][x] !== 1) p = { x: x, y: y };
      this._mePos = p || { x: 0, y: G.R - 1 };
      this._push();
    }
    _avatar(id, isMe) {
      var a = this._els.avs.querySelector('[data-pid="' + id + '"]');
      if (!a) {
        a = el('div', 'qk-vil-av' + (isMe ? ' me' : ''));
        a.dataset.pid = id;
        a.innerHTML = '<span class="bub" hidden></span><span class="hd" hidden aria-label="손 들었어요">✋</span>' + (this._art ? '<span class="body"><img class="bd" alt="" draggable="false"><img class="hh" alt="" draggable="false"></span>' : '<img class="hh" alt="" width="40" height="40">') + '<span class="sh"></span><span class="nm"></span>';
        this._els.avs.appendChild(a);
      }
      return a;
    }
    _place(a, s) {
      var G = this._g, g = this._grid(), sit = g[s.y] && g[s.y][s.x] === 2;
      if (this._art) {
        var bd = VART.body[sit ? 'sit' : 'stand'], u = G.T / 146.3, w = bd[0] * u, h = bd[1] * u;
        a.style.transform = 'translate(' + (s.x * G.T + (G.T - w) / 2) + 'px,' + (G.wall + (s.y + 1) * G.Th - h - G.Th * (sit ? 0.16 : 0.08)) + 'px)';
        a.style.width = w + 'px'; a.style.height = h + 'px';
        var bimg = a.querySelector('.bd'), want = this._art + 'body-' + (sit ? 'sit' : 'stand') + '.webp';
        if (bimg.getAttribute('src') !== want) bimg.src = want;
      } else {
        a.style.transform = 'translate(' + s.x * G.T + 'px,' + ((G.wall / G.T + s.y) * G.T - 24 + (sit ? 8 : 0)) + 'px)';
      }
      a.style.zIndex = (s.y + 1) * 10 + 6;
      a.classList.toggle('sit', !!sit);
      var img = a.querySelector('.hh'), src = vface(s.ex || 'smile', s.ac || '');
      if (img.getAttribute('src') !== src) img.src = src;
      a.querySelector('.nm').textContent = (s.n || '쿼카') + (s.bot ? ' (견본)' : '');
      a.querySelector('.hd').hidden = !s.hd;
    }
    _drawMe() { if (!this._els || !this._mePos) return; this._place(this._avatar('me', true), this._state()); }
    _state() { var m = this._me, p = this._mePos || { x: 0, y: 0 }; return { x: p.x, y: p.y, n: m.name, ac: m.acc, ex: this._expr, hd: this._hand ? 1 : 0, sy: this._say ? this._say.t : '', sa: this._say ? this._say.at : 0, cl: this._call }; }
    _push() { this._drawMe(); this._camera(); if (this._rt) try { this._rt.move(this._state()); } catch (e) {} }
    _peersIn(list) {
      var self = this, seen = {}, G = this._g; if (!this._els) return;
      list.forEach(function (p) {
        if (p.me) return;
        var s = p.s || {}; if (typeof s.x !== 'number') return;
        seen[p.id] = 1;
        var prev = self._peers[p.id] || {}, a = self._avatar(p.id, false);
        self._place(a, { x: Math.max(0, Math.min(G.C - 1, s.x | 0)), y: Math.max(0, Math.min(G.R - 1, s.y | 0)), n: String(s.n || '').slice(0, 10), ac: String(s.ac || ''), ex: String(s.ex || 'smile'), hd: s.hd, bot: s.bot });
        if (s.sa && s.sa !== prev.sa && s.sy) self._bubble(a, String(s.sy).slice(0, 80), String(s.n || '쿼카').slice(0, 10));
        if (s.cl && s.cl.at && (!prev.cl || prev.cl.at !== s.cl.at) && Date.now() - s.cl.at < 60000) self._called(String(s.n || '쿼카').slice(0, 10), s.cl);
        self._peers[p.id] = s;
      });
      Object.keys(this._peers).forEach(function (k) { if (!seen[k] && !(self._botsOn && k.indexOf('bot') === 0)) { var a = self._els.avs.querySelector('[data-pid="' + k + '"]'); if (a) a.remove(); delete self._peers[k]; } });
      this._roomList = list;
      this._paintPeople();
    }
    _paintPeople() {
      var E = this._els, self = this; if (!E) return;
      var me = this._state(), ppl = [{ n: me.n + ' (나)', ac: me.ac, hd: me.hd }];
      Object.keys(this._peers).forEach(function (k) { var s = self._peers[k]; ppl.push({ n: (s.n || '쿼카') + (s.bot ? ' (견본)' : ''), ac: s.ac, hd: s.hd }); });
      E.ppl.innerHTML = '';
      ppl.forEach(function (p) { var li = el('li', '', '<img alt="" width="26" height="26" src="' + vface('smile', p.ac || '') + '"><span></span>' + (p.hd ? '<i>✋</i>' : '')); li.querySelector('span').textContent = String(p.n).slice(0, 16); E.ppl.appendChild(li); });
      E.pc.textContent = ppl.length + '명';
    }
    _bubble(a, text, name) {
      var b = a.querySelector('.bub'); b.textContent = text; b.hidden = false;
      clearTimeout(a._bt); a._bt = setTimeout(function () { b.hidden = true; }, 6000);
      var E = this._els; if (!E) return;
      var li = el('li', '', '<b></b><span></span>'); li.querySelector('b').textContent = name; li.querySelector('span').textContent = text;
      E.log.appendChild(li); while (E.log.children.length > 30) E.log.firstChild.remove();
      E.log.scrollTop = E.log.scrollHeight;
    }
    say(text) { text = String(text || '').trim().slice(0, 80); if (!text || !this._els) return; this._say = { t: text, at: Date.now() }; this._bubble(this._avatar('me', true), text, this._me.name); this._push(); }
    emote(ex) { var self = this; this._expr = ex; this._push(); clearTimeout(this._exT); this._exT = setTimeout(function () { self._expr = 'smile'; self._push(); }, 4000); }
    _tableSpot() { var t = (this._layout.items || []).filter(function (i) { return i.k === 'table'; })[0]; return t ? { x: t.x + 1, y: Math.min(this._g.R - 1, t.y + 2) } : { x: this._mePos.x, y: this._mePos.y }; }
    _gather() { var s = this._tableSpot(); this._call = { x: s.x, y: s.y, at: Date.now() }; this.say('다들 모여요! 🙌'); this.walkTo(s.x, s.y); toast('회의 탁자로 불렀어요', { mood: 'happy' }); }
    _called(name, cl) { var self = this; toast(name + '님이 모이자고 해요', { mood: 'excited', time: 6000, action: { label: '가기', onClick: function () { self.walkTo(cl.x | 0, cl.y | 0); } } }); }
    walkTo(tx, ty) {
      var G = this._g, g = this._grid(), s = this._mePos; if (!s) return;
      tx = Math.max(0, Math.min(G.C - 1, tx)); ty = Math.max(0, Math.min(G.R - 1, ty));
      var prev = {}, q = [[s.x, s.y]], key = function (x, y) { return x + ',' + y; }, goal = null, best = null, bd = 1e9;
      prev[key(s.x, s.y)] = null;
      while (q.length) {
        var c = q.shift(), d0 = Math.abs(c[0] - tx) + Math.abs(c[1] - ty);
        if (d0 < bd) { bd = d0; best = c; }
        if (c[0] === tx && c[1] === ty) { goal = c; break; }
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dd) {
          var nx = c[0] + dd[0], ny = c[1] + dd[1], k = key(nx, ny);
          if (nx < 0 || ny < 0 || nx >= G.C || ny >= G.R || k in prev || g[ny][nx] === 1) return;
          prev[k] = c; q.push([nx, ny]);
        });
      }
      var end = goal || best, path = [];
      while (end && prev[key(end[0], end[1])] !== undefined && !(end[0] === s.x && end[1] === s.y)) { path.unshift(end); end = prev[key(end[0], end[1])]; }
      this._steps = path; this._stepNext();
    }
    _stepNext() {
      var self = this; clearTimeout(this._walkT);
      var n = this._steps && this._steps.shift(); if (!n) { if (this._els) this._avatar('me', true).classList.remove('walk'); return; }
      this._mePos = { x: n[0], y: n[1] };
      this._avatar('me', true).classList.add('walk');
      this._push();
      this._walkT = setTimeout(function () { self._stepNext(); }, reduceMotion() ? 60 : 190);
    }
    _key(e) {
      if (this._view !== 'room' || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || (this._sheet && this._sheet.hasAttribute('open'))) return;
      var d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
      if (e.key === 'Escape' && this._editing) { this._pick = null; this._sel = null; this._paintRoom(); this._paintDeco(); return; }
      if (e.key === 'Enter' && !this._editing) { e.preventDefault(); this._els.dock.querySelector('input').focus(); return; }
      if (!d || this._editing) return;
      e.preventDefault();
      var p = this._mePos, g = this._grid(), G = this._g, nx = p.x + d[0], ny = p.y + d[1];
      if (nx < 0 || ny < 0 || nx >= G.C || ny >= G.R) return;
      if (g[ny][nx] === 1) { var hit = this._itemAt({ x: nx, y: ny }); if (hit && vdef(hit.k).act) this.open(vdef(hit.k).act); return; }
      this._steps = [[nx, ny]]; this._stepNext();
    }
    _tile(e) {
      var G = this._g, r = this._els.scene.getBoundingClientRect(), s = this._scale || 1;
      var px = (e.clientX - r.left) / s, py = (e.clientY - r.top) / s;
      return { x: Math.floor(px / G.T), y: py < G.wall ? -1 : Math.min(G.R - 1, Math.floor((py - G.wall) / G.Th)), px: px, py: py };
    }
    _itemAt(t, wallToo) {
      var self = this, hit = null;
      (this._layout.items || []).forEach(function (it) {
        var d = vdef(it.k); if (!d) return;
        if (d.kind === 'w') { if (wallToo && t.y < 0 && t.x >= it.x && t.x < it.x + d.w) hit = it; return; }
        if (t.x >= it.x && t.x < it.x + d.w && t.y >= it.y && t.y < it.y + d.h && (!hit || vdef(hit.k).kind === 'r')) hit = it;
      });
      if (!hit && t.px != null) { // 그림이 위로 솟은 가구(책장·화이트보드)는 그림을 눌러도 잡힌다
        (this._layout.items || []).forEach(function (it) { var d = vdef(it.k); if (!d || d.kind !== 'f') return; var b = self._itemBox(it); if (t.px >= b.l && t.px <= b.l + b.w && t.py >= b.t && t.py <= b.t + b.h) hit = it; });
      }
      return hit;
    }
    _down(e) {
      var t = this._tile(e);
      if (!this._editing) {
        var hit = this._itemAt(t, true), d = hit && vdef(hit.k);
        if (d && d.act) { this.open(d.act); return; }
        if (t.y >= 0) this.walkTo(t.x, t.y);
        this._els.stage.focus({ preventScroll: true }); return;
      }
      if (this._pick) { this._placeNew(this._pick, t); return; }
      var hit2 = this._itemAt(t, true);
      this._sel = hit2 ? hit2.id : null; this._paintRoom(); this._paintDeco();
      if (hit2) { this._drag = { id: hit2.id, ox: t.x - hit2.x, oy: t.y - hit2.y, moved: false }; try { this._els.scene.setPointerCapture(e.pointerId); } catch (er) {} }
    }
    _hover(e) {
      var t = this._tile(e);
      if (!this._editing) { var h = this._itemAt(t, true); this._els.scene.classList.toggle('pointing', !!(h && vdef(h.k).act)); return; }
      if (this._drag) {
        var it = this._find(this._drag.id), d = vdef(it.k), nx = t.x - this._drag.ox, ny = d.kind === 'w' ? 0 : t.y - this._drag.oy;
        if (nx !== it.x || ny !== it.y) { this._drag.moved = true; this._dragging = true; }
        this._ghost(it.k, it.c, nx, ny, this._fits(it.k, nx, ny, it.id)); return;
      }
      if (this._pick) { var dk = vdef(this._pick), gx = t.x - (dk.w > 1 ? Math.floor(dk.w / 2) : 0), gy = dk.kind === 'w' ? 0 : t.y; this._ghost(this._pick, this._pickC, gx, gy, this._fits(this._pick, gx, gy)); }
      else this._els.ghost.hidden = true;
    }
    _up(e) {
      if (!this._drag) return;
      var dr = this._drag; this._drag = null; this._dragging = false; this._els.ghost.hidden = true;
      if (!dr.moved) return;
      var it = this._find(dr.id), d = vdef(it.k), t = this._tile(e), nx = t.x - dr.ox, ny = d.kind === 'w' ? 0 : t.y - dr.oy;
      if (this._fits(it.k, nx, ny, it.id)) { it.x = nx; it.y = ny; this._changed(); } else toast('여기엔 놓을 수 없어요', { mood: 'worried', time: 1600 });
      this._paintRoom();
    }
    _ghost(k, c, x, y, ok) {
      var G = this._els.ghost, it = { k: k, c: c || 'mint', x: x, y: y }, bx = this._itemBox(it);
      G.hidden = false; G.innerHTML = this._itemHTML(it);
      G.className = 'ghost' + (ok ? '' : ' bad');
      G.style.cssText = 'left:' + bx.l + 'px;top:' + bx.t + 'px;width:' + bx.w + 'px;height:' + bx.h + 'px';
    }
    _find(id) { return (this._layout.items || []).filter(function (i) { return i.id === id; })[0]; }
    _fits(k, x, y, skipId) {
      var d = vdef(k), G = this._g; if (!d) return false;
      if (x < 0 || x + d.w > G.C) return false;
      if (d.kind === 'w') {
        if (G.win && G.win.length && x <= G.win[1] && x + d.w - 1 >= G.win[0]) return false; // 창문 자리
        return !(this._layout.items || []).some(function (it) { var e = vdef(it.k); return it.id !== skipId && e && e.kind === 'w' && x < it.x + e.w && it.x < x + d.w; });
      }
      if (y < 0 || y + d.h > G.R) return false;
      return !(this._layout.items || []).some(function (it) {
        var e = vdef(it.k); if (it.id === skipId || !e || e.kind === 'w') return false;
        if ((d.kind === 'r') !== (e.kind === 'r')) return false;
        return x < it.x + e.w && it.x < x + d.w && y < it.y + e.h && it.y < y + d.h;
      });
    }
    _placeNew(k, t) {
      var d = vdef(k), x = t.x - (d.w > 1 ? Math.floor(d.w / 2) : 0), y = d.kind === 'w' ? 0 : t.y;
      if (!this._fits(k, x, y)) { toast('여기엔 놓을 수 없어요', { mood: 'worried', time: 1600 }); return; }
      if ((this._layout.items || []).length >= 60) { toast('방 하나엔 60개까지 놓을 수 있어요', { mood: 'worried' }); return; }
      var it = { id: k + Date.now().toString(36), k: k, x: x, y: y, c: this._pickC || 'mint' };
      this._layout.items.push(it); this._sel = it.id;
      this._changed(); this._paintRoom(); this._paintDeco();
    }
    _changed() { var self = this; this._pendingSave = true; clearTimeout(this._saveT); this._saveT = setTimeout(function () { self._flushSave(); }, 700); }
    _flushSave() {
      var self = this, key = this._room || this._lastRoom, L = JSON.parse(JSON.stringify(this._layout));
      this._pendingSave = false; clearTimeout(this._saveT);
      if (!key) return;
      this._saving = (this._saving || Promise.resolve()).then(function () { return self.adapter.save(key, L); }).then(function () {
        self.dispatchEvent(new CustomEvent('saved', { detail: { room: key }, bubbles: true }));
      }, function () { toast('저장하지 못했어요. 잠시 뒤 다시 해 볼게요', { mood: 'error' }); });
    }
    // ── 꾸미기 ──
    decorate(on) {
      this._editing = !!on; this._pick = null; this._sel = null; this._lastRoom = this._room;
      var E = this._els; if (!E) return;
      E.bar.querySelector('.deco').textContent = on ? '다 꾸몄어요' : '꾸미기';
      E.bar.querySelector('.deco').classList.toggle('go', !!on);
      E.dock.hidden = !!on; E.deco.hidden = !on; E.scene.classList.toggle('editing', !!on);
      E.ghost.hidden = true;
      if (!on && this._pendingSave) { this._flushSave(); toast('방을 저장했어요', { mood: 'happy' }); }
      this._paintRoom(); if (on) this._paintDeco();
    }
    _paintDeco() {
      var self = this, E = this._els, L = this._layout, D = E.deco; if (!this._editing) return;
      var cat = this._cat || 0, sel = this._sel ? this._find(this._sel) : null;
      D.innerHTML = '';
      var tabs = el('div', 'qv-tabs');
      VCATS.concat([['벽지·공지', null]]).forEach(function (c, i) { var b = el('button', 'qk-vil-tab', c[0]); b.type = 'button'; b.setAttribute('aria-pressed', String(i === cat)); b.addEventListener('click', function () { self._cat = i; self._pick = null; self._paintDeco(); }); tabs.appendChild(b); });
      D.appendChild(tabs);
      var body = el('div', 'body');
      if (VCATS[cat]) {
        var grid = el('div', 'pal');
        VCATS[cat][1].forEach(function (k) {
          var d = vdef(k), th = self._art && k !== 'rug' ? '<img alt="" src="' + self._art + 'items/' + k + '.webp">' : (k === 'rug' ? '<span class="rug" style="background:' + (VPAL[self._pickC || 'lavender'] || VPAL.lavender)[1] + ';border-color:' + (VPAL[self._pickC || 'lavender'] || VPAL.lavender)[0] + '"></span>' : vsvg(k, self._pickC || 'mint', 22));
          var b = el('button', 'qk-vil-pick', '<span class="th">' + th + '</span><span>' + d.label + (d.act ? ' ★' : '') + '</span>');
          b.type = 'button'; b.setAttribute('aria-pressed', String(self._pick === k));
          if (d.act) b.title = { notes: '누르면 포스트잇 보드', meet: '누르면 모임(주제·타이머·출석 도장)', links: '누르면 자료 책장' }[d.act];
          b.addEventListener('click', function () { self._pick = self._pick === k ? null : k; self._sel = null; self._paintRoom(); self._paintDeco(); });
          grid.appendChild(b);
        });
        body.appendChild(grid);
        if (!this._art || this._pick === 'rug' || (sel && sel.k === 'rug')) body.appendChild(this._swatches(sel ? sel.c : (this._pickC || 'lavender'), function (c) { if (sel) { sel.c = c; self._changed(); self._paintRoom(); } else self._pickC = c; self._paintDeco(); }, sel ? '고른 것 색' : '놓을 색'));
      } else {
        if (this._room !== 'plaza') {
          var walls = this._art ? ['mint', 'pink', 'lavender'] : Object.keys(VPAL);
          var w = el('div', 'sw', '<span>벽지</span>');
          walls.forEach(function (c) { var b = el('button', 'qk-vil-sw'); b.type = 'button'; b.style.background = VPAL[c][0]; b.setAttribute('aria-label', VCOL[c]); b.setAttribute('aria-pressed', String(L.wall === c)); b.addEventListener('click', function () { L.wall = c; L.floor = c; self._changed(); self._applyGeo(); self._paintRoom(); self._paintDeco(); }); w.appendChild(b); });
          body.appendChild(w);
        }
        var nl = el('label', 'ntc', '<span>방 공지 한 줄</span>'), ni = document.createElement('input');
        ni.maxLength = 40; ni.value = L.notice || ''; ni.placeholder = '예: 12월 모임 주제는 AI 윤리';
        ni.addEventListener('input', function () { L.notice = ni.value.slice(0, 40); E.ntc.textContent = L.notice; self._changed(); });
        nl.appendChild(ni); body.appendChild(nl);
        var rs = el('button', 'qk-gbtn', '처음 모습으로'); rs.type = 'button';
        rs.addEventListener('click', function () { self._layout = self._defLayout(self._room); self._changed(); self._applyGeo(); self._paintRoom(); self._paintDeco(); toast('처음 모습으로 돌렸어요', { mood: 'calm' }); });
        body.appendChild(rs);
      }
      D.appendChild(body);
      var foot = el('p', 'hint');
      if (sel) {
        foot.innerHTML = '<b></b> 골랐어요 · 끌어서 옮겨요 ';
        foot.querySelector('b').textContent = vdef(sel.k).label;
        var del = el('button', 'qk-gbtn', '치우기'); del.type = 'button';
        del.addEventListener('click', function () { L.items = L.items.filter(function (i) { return i.id !== sel.id; }); self._sel = null; self._changed(); self._paintRoom(); self._paintDeco(); });
        foot.appendChild(del);
      } else foot.textContent = this._pick ? '방에서 놓을 칸을 누르세요 · Esc로 그만' : '★ 표시는 눌러서 쓰는 가구예요 · 방에 있는 것을 눌러 옮기거나 치워요';
      D.appendChild(foot);
    }
    _swatches(cur, fn, label) {
      var w = el('div', 'sw', '<span>' + label + '</span>');
      Object.keys(VPAL).forEach(function (c) {
        var b = el('button', 'qk-vil-sw'); b.type = 'button'; b.style.background = VPAL[c][0]; b.setAttribute('aria-label', VCOL[c]); b.title = VCOL[c];
        b.setAttribute('aria-pressed', String(c === cur));
        b.addEventListener('click', function () { fn(c); });
        w.appendChild(b);
      });
      return w;
    }
    // ── 견본 친구(이 화면에만 보이는 가짜 쿼카) ──
    friends(on) { this._bots = !!on; if (this._view === 'room') { if (on) this._botsStart(); else this._botsStop(); } }
    _botsStart() {
      var self = this; this._botsStop(); this._botsOn = true;
      var g = this._grid(), G = this._g, free = [];
      for (var y = 0; y < G.R; y++) for (var x = 0; x < G.C; x++) if (g[y][x] !== 1) free.push([x, y]);
      this._botS = VBOT.map(function (b, i) { var p = free[(i * 17 + 5) % free.length]; return { id: 'bot' + i, x: p[0], y: p[1], n: b[0], ac: b[1], ex: 'smile', hd: 0, bot: 1, sy: '', sa: 0 }; });
      var feed = function () { self._peersIn((self._roomList || []).filter(function (p) { return String(p.id).indexOf('bot') !== 0; }).concat(self._botS.map(function (b) { return { id: b.id, me: false, s: b }; }))); };
      feed();
      this._botT = setInterval(function () {
        if (!self._els) return;
        var b = self._botS[Math.floor(Math.random() * self._botS.length)], gg = self._grid(), r = Math.random();
        if (r < 0.55) { var dx = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)], nx = b.x + dx[0], ny = b.y + dx[1]; if (nx >= 0 && ny >= 0 && nx < G.C && ny < G.R && gg[ny][nx] !== 1) { b.x = nx; b.y = ny; } }
        else if (r < 0.7) { b.sy = VBOT_SAY[Math.floor(Math.random() * VBOT_SAY.length)]; b.sa = Date.now(); }
        else if (r < 0.85) { b.ex = EMOTES[Math.floor(Math.random() * EMOTES.length)][0]; }
        else if (r < 0.92) { b.hd = b.hd ? 0 : 1; }
        else b.ex = 'smile';
        feed();
      }, 1100);
    }
    _botsStop() {
      clearInterval(this._botT); this._botT = 0; this._botsOn = false;
      var self = this; if (!this._els) return;
      Object.keys(this._peers || {}).forEach(function (k) { if (k.indexOf('bot') === 0) { var a = self._els.avs.querySelector('[data-pid="' + k + '"]'); if (a) a.remove(); delete self._peers[k]; } });
      this._paintPeople();
    }
  }

  // ── 40. 함께 쓰는 저장소 ───────────────────────────────────────
  // 운영실 · 조직도 · 지역연구회가 같은 저장소를 본다. 한쪽에서 고치면 다른 쪽도 바로 바뀐다.
  // store = { list(모음, fn) → 해제 함수, put(모음, 항목), del(모음, id) } · 항목엔 id가 꼭 있어야 한다
  // 모음: teams · tfs · tasks · reqs · regions · rposts · rlinks · rsvp
  // QuokaKit.localStore(ns) = 이 브라우저 안(localStorage, 탭끼리 storage 이벤트). 홈페이지에선 같은 모양으로 Supabase·Firebase에 잇는다.
  function localStore(ns) {
    ns = ns || 'qk-store';
    var subs = {}, mem = {};
    function key(c) { return ns + ':' + c; }
    function read(c) { var v = null; try { v = JSON.parse(root.localStorage.getItem(key(c))); } catch (e) {} return v || mem[c] || {}; }
    function vals(c) { var m = read(c); return Object.keys(m).map(function (k) { return m[k]; }); }
    function fire(c) { (subs[c] || []).slice().forEach(function (fn) { fn(vals(c)); }); }
    function write(c, m) { mem[c] = m; try { root.localStorage.setItem(key(c), JSON.stringify(m)); } catch (e) {} fire(c); }
    root.addEventListener('storage', function (e) { if (e.key && e.key.indexOf(ns + ':') === 0) fire(e.key.slice(ns.length + 1)); });
    return {
      list: function (c, fn) { (subs[c] = subs[c] || []).push(fn); setTimeout(function () { fn(vals(c)); }, 0); return function () { subs[c] = (subs[c] || []).filter(function (f) { return f !== fn; }); }; },
      put: function (c, item) { var m = read(c); m[item.id] = JSON.parse(JSON.stringify(item)); write(c, m); return Promise.resolve(); },
      del: function (c, id) { var m = read(c); delete m[id]; write(c, m); return Promise.resolve(); },
      seed: function (data) { Object.keys(data).forEach(function (c) { var m = read(c); if (Object.keys(m).length) return; data[c].forEach(function (it) { m[it.id] = it; }); write(c, m); }); },
      reset: function (data) { Object.keys(data).forEach(function (c) { var m = {}; data[c].forEach(function (it) { m[it.id] = it; }); write(c, m); }); }
    };
  }
  var sharedStore = null;
  function kitStore() { return sharedStore || (sharedStore = localStore('qk-store')); }

  // 운영 쪽 공통 재료
  var OPS_TEAMS = ['planning', 'training-team', 'pr', 'admin', 'contest'];
  var OPS_DIVS = ['ai-civic', 'physical-ai', 'ai-media', 'ai-sel', 'ai-dev', 'ai-content'];
  var TEAM_ROLE = {
    planning: '연간 계획 · 운영진 회의 · 전체 일정과 신청 관리', 'training-team': '원격연수 · 대면 연수 기획과 강사 섭외',
    pr: '카드뉴스 · SNS · 블로그 · 소식지', admin: '회비 · 예산 · 정산 · 물품과 장소', contest: '연구대회 준비 모임 · 보고서 함께 읽기',
    'ai-civic': 'AI 시대의 민주시민 수업', 'physical-ai': '센서·로봇으로 만지는 AI', 'ai-media': 'AI로 읽고 만드는 미디어',
    'ai-sel': '마음과 관계를 여는 AI 수업', 'ai-dev': '바이브코딩으로 수업 도구 만들기', 'ai-content': '생성형 AI로 수업 콘텐츠 만들기'
  };
  var OPS_KIND = { pr: ['홍보', 'pink'], training: ['연수', 'mint'], money: ['정산·구매', 'lavender'], place: ['일정·장소', 'gray'], design: ['자료·디자인', 'mint'], region: ['지역연구회 열기', 'pink'], etc: ['기타', 'gray'] };
  var OPS_COL = [['todo', '할 일'], ['doing', '하는 중'], ['done', '끝']];
  var NICK_ACC = ['pom-beanie', 'cap', 'beret', 'glasses', 'headphones', 'ribbon', 'sprout', 'beanie', 'hairband', 'bucket', 'blossom', 'pencil'];
  // 지역 타일 지도: [key, 이름, 칸(가로), 줄(세로)]
  var SIDO = [['seoul', '서울', 1, 0], ['gangwon', '강원', 2, 0], ['incheon', '인천', 0, 1], ['gyeonggi', '경기', 1, 1], ['chungbuk', '충북', 2, 1], ['gyeongbuk', '경북', 3, 1],
    ['chungnam', '충남', 0, 2], ['sejong', '세종', 1, 2], ['daejeon', '대전', 2, 2], ['daegu', '대구', 3, 2], ['ulsan', '울산', 4, 2],
    ['jeonbuk', '전북', 1, 3], ['gyeongnam', '경남', 2, 3], ['busan', '부산', 3, 3], ['gwangju', '광주', 0, 4], ['jeonnam', '전남', 1, 4], ['jeju', '제주', 0, 5]];
  var RG_ACC = [['bucket', '버킷햇'], ['pom-beanie', '방울 비니'], ['beret', '베레모'], ['cap', '볼캡'], ['beanie', '비니'], ['headphones', '헤드폰'], ['sunglasses-up', '머리 위 선글라스'], ['ribbon', '리본'], ['blossom', '벚꽃 핀'], ['sprout', '새싹 핀']];
  var TONE_SOFT = { pink: '#FDE7EF', mint: '#E1F5EE', lavender: '#EEE9FC', gray: '#EEF0F4' };
  var TONE_INK = { pink: '#C2557E', mint: '#2F8F75', lavender: '#6A55C2', gray: '#5C6270' };

  function kitMe() { var m = null; try { m = JSON.parse(store('qk-me')); } catch (e) {} if (!m) { try { var v = JSON.parse(store('qk-village-me')); if (v && v.name) m = { name: v.name, team: '' }; } catch (e) {} } return m; }
  function uid(p) { return (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function todayStr() { return vday(); }
  function dayAdd(n) { var d = new Date(); d.setDate(d.getDate() + n); return vday(d); }
  function dleft(s) { var d = parseDay(s); return d ? dayDiff(d, parseDay(new Date())) : null; }
  function dlabel(s) { var n = dleft(s); if (n == null) return ''; return n < 0 ? -n + '일 지남' : n === 0 ? '오늘' : 'D-' + n; }
  function dcls(s) { var n = dleft(s); return n == null ? '' : n < 0 ? 'late' : n <= 3 ? 'soon' : ''; }
  function mday(s) { var d = parseDay(s); return d ? (d.getMonth() + 1) + '.' + d.getDate() : ''; }
  var WEEKD = ['일', '월', '화', '수', '목', '금', '토'];
  function longDay(s) { var d = parseDay(s); return d ? (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + WEEKD[d.getDay()] + ')' : ''; }
  var nickCache = {};
  function nickFace(n) { n = String(n || ''); return nickCache[n] || (nickCache[n] = Q.url({ expression: 'smile', accessory: [NICK_ACC[seedHash(n) % NICK_ACC.length]] })); }
  function faceTag(n, s) { return '<img class="qo-face" alt="" width="' + s + '" height="' + s + '" src="' + nickFace(n) + '">'; }
  function names(s) { return String(s || '').split(/[,\n·]/).map(function (x) { return x.trim().slice(0, 12); }).filter(Boolean).slice(0, 12); }
  function busy(box) { var a = document.activeElement; return a && box.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName); }
  // 저장소에서 받은 글은 남이 쓴 것이라 textContent로만 넣는다
  function txt(node, sel, v) { var n = sel ? node.querySelector(sel) : node; if (n) n.textContent = v == null ? '' : String(v); return n; }
  function sheetForm(sheet, heading, mascot, html, onSubmit, extra) {
    sheet.setAttribute('heading', heading); sheet.setAttribute('mascot', mascot || 'happy');
    var body = sheet.querySelector('.qk-sheet-body'); body.innerHTML = '';
    var f = el('form', 'qo-form', html); body.appendChild(f);
    f.addEventListener('submit', function (e) { e.preventDefault(); if (onSubmit(f) !== false) sheet.close(); });
    if (extra) extra(f);
    sheet.show();
    setTimeout(function () { var i = f.querySelector('input:not([type=hidden]),textarea'); if (i && !matchMedia('(max-width:720px)').matches) i.focus(); }, 60);
    return f;
  }
  function fld(label, inner, hint) { return '<label class="qo-f"><span>' + label + '</span>' + inner + (hint ? '<small>' + hint + '</small>' : '') + '</label>'; }
  function opt(v, label, cur) { return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(label) + '</option>'; }

  // 견본 데이터(이름은 모두 지어낸 닉네임) — localStore.seed(QuokaKit.opsSample())
  function opsSample() {
    var T = function (id, intro, lead, members, memo) { return { id: id, intro: intro || TEAM_ROLE[id] || '', lead: lead, members: members, memo: memo || '' }; };
    var teams = [T('planning', '', '바람쌤', ['구름쌤', '연필쌤', '도토리쌤'], '12월 운영진 회의는 셋째 주 수요일'), T('training-team', '', '별빛쌤', ['라떼쌤', '봄비쌤', '이슬쌤']),
      T('pr', '', '솜사탕쌤', ['반달쌤', '초코쌤']), T('admin', '', '단풍쌤', ['콩떡쌤', '하늘쌤', '노을쌤']), T('contest', '', '몽글쌤', ['바다쌤']),
      T('ai-civic', '', '새싹쌤', ['모카쌤', '파랑쌤']), T('physical-ai', '', '나무쌤', ['자두쌤']), T('ai-media', '', '민트쌤', ['모래쌤', '달콤쌤']),
      T('ai-sel', '', '포근쌤', ['마루쌤', '소리쌤']), T('ai-dev', '', '코코쌤', ['비트쌤']), T('ai-content', '', '그림쌤', ['물감쌤', '종이쌤'])];
    var tfs = [
      { id: 'tf-recruit', name: '2027 신규 회원 모집 TF', goal: '12.12~12.30 전국 모집 · 카드뉴스 3장 · 신청 폼', start: dayAdd(-10), end: dayAdd(55), members: ['바람쌤', '솜사탕쌤', '단풍쌤'], tone: 'pink', status: 'on', at: Date.now() - 864e6 },
      { id: 'tf-site', name: '홈페이지 새 단장 TF', goal: '쿼카 키트로 2027 홈페이지 열기', start: dayAdd(-20), end: dayAdd(40), members: ['코코쌤', '비트쌤', '반달쌤'], tone: 'mint', status: 'on', at: Date.now() - 1728e6 },
      { id: 'tf-book', name: '2026 사례집 발간 TF', goal: '학교자율시간 AI 수업 사례집', start: dayAdd(-200), end: dayAdd(-60), members: ['그림쌤', '포근쌤', '연필쌤', '이슬쌤'], tone: 'lavender', status: 'done', result: '사례 24편을 모아 자료집 한 권으로 냈어요', at: Date.now() - 1728e7 }];
    var K = function (id, team, title, who, due, st, req) { return { id: id, team: team, title: title, who: who, due: due == null ? '' : dayAdd(due), st: st, req: req || '', at: Date.now() - (+id.slice(1)) * 36e5 }; };
    var tasks = [K('k1', 'planning', '2027 운영진 공개모집 안내 확정', '바람쌤', 3, 'doing'), K('k2', 'planning', '12월 운영진 회의 안건 모으기', '구름쌤', 8, 'todo'), K('k3', 'planning', '2027 연간 일정표 초안', '연필쌤', null, 'done'),
      K('k4', 'training-team', '겨울 원격연수 강사 섭외', '별빛쌤', 6, 'doing'), K('k5', 'training-team', '연수 신청 폼 만들기', '라떼쌤', 12, 'todo'),
      K('k6', 'pr', '신규 회원 모집 카드뉴스 3장', '솜사탕쌤', 5, 'doing', 'q1'), K('k7', 'pr', '블로그 11월 소식 올리기', '반달쌤', 2, 'todo'),
      K('k8', 'admin', '2027 회비 안내문 검토', '단풍쌤', 9, 'todo'), K('k9', 'admin', '11월 모임 장소 예약', '콩떡쌤', null, 'done'),
      K('k10', 'contest', '연구대회 준비 모임 공지', '몽글쌤', 14, 'todo'),
      K('k11', 'tf-recruit', '신청 폼 문항 확정', '바람쌤', 2, 'doing'), K('k12', 'tf-recruit', '모집 카드뉴스 요청하기', '솜사탕쌤', null, 'done'), K('k13', 'tf-recruit', '신청 현황 나누는 방법 정하기', '단풍쌤', 10, 'todo'),
      K('k14', 'tf-site', '지역연구회 페이지 시안', '코코쌤', 4, 'doing'), K('k15', 'tf-site', '운영실 써 보고 고칠 점 모으기', '비트쌤', 7, 'todo'),
      K('k16', 'ai-sel', '감정 체크인 수업 나눔 준비', '포근쌤', 11, 'todo'), K('k17', 'ai-dev', '바이브코딩 첫 모임 자료', '코코쌤', 6, 'doing')];
    var R = function (id, from, to, kind, title, body, due, st, by, region) { return { id: id, from: from, to: to, kind: kind, title: title, body: body, due: due == null ? '' : dayAdd(due), st: st, by: by, region: region || '', at: Date.now() - (+id.slice(1)) * 36e5 }; };
    var reqs = [R('q1', 'tf-recruit', 'pr', 'pr', '신규 회원 모집 카드뉴스 3장', '12.12 열림 · 전국 초등 선생님 대상이라 지역 이름은 빼 주세요', 5, 'ok', '바람쌤'),
      R('q2', 'planning', 'admin', 'place', '12월 대면 모임 장소 예약', '40명 · 빔프로젝터 · 오후 4시 30분', 10, 'new', '구름쌤'),
      R('q3', 'training-team', 'pr', 'pr', '겨울 원격연수 홍보 카드', '연수 일정이 정해지면 같이 볼게요', 15, 'new', '별빛쌤'),
      R('q4', 'region', 'planning', 'region', '쿼카 충북 열기 신청', '청주·충주 선생님 여섯 명이 함께 시작하고 싶어요', null, 'new', '도담쌤', 'r-chungbuk')];
    var G = function (id, sido, name, intro, tone, acc, pres, vice, sec, members, status, next) { return { id: id, sido: sido, name: name, intro: intro, tone: tone, acc: acc, pres: pres, vice: vice, sec: sec, members: members, status: status, next: next || null, at: Date.now() }; };
    var regions = [
      G('r-gyeonggi-s', 'gyeonggi', '쿼카 경기남부', '수원·화성·용인 선생님들이 한 달에 한 번, 수업 하나씩 들고 만나요', 'mint', 'bucket', '소나무쌤', '은행쌤', '복숭아쌤', 18, 'open', { date: dayAdd(14), time: '16:30', mode: 'off', place: '수원 OO초 도서실', topic: 'AI 코스웨어로 2학기 돌아보기', link: '' }),
      G('r-gyeonggi-n', 'gyeonggi', '쿼카 경기북부', '고양·파주·의정부 · 온라인 반, 대면 반을 번갈아 열어요', 'pink', 'beret', '들꽃쌤', '', '자몽쌤', 11, 'open', { date: dayAdd(21), time: '20:00', mode: 'on', place: '온라인(줌)', topic: '바이브코딩으로 학급 도구 만들기', link: '' }),
      G('r-seoul', 'seoul', '쿼카 서울', '퇴근길에 들르는 수업 나눔 모임', 'lavender', 'cap', '한강쌤', '남산쌤', '', 23, 'open', { date: dayAdd(9), time: '17:00', mode: 'off', place: '서울 OO초 회의실', topic: '사회정서 수업과 에듀테크', link: '' }),
      G('r-busan', 'busan', '쿼카 부산·울산', '바다 보며 AI 수업 이야기해요', 'mint', 'sunglasses-up', '갈매기쌤', '', '', 9, 'open', null),
      G('r-chungbuk', 'chungbuk', '쿼카 충북', '청주·충주에서 처음 문을 열어요', 'lavender', 'sprout', '도담쌤', '', '', 6, 'prep', null)];
    var P = function (id, region, kind, title, body, date) { return { id: id, region: region, kind: kind, title: title, body: body, date: dayAdd(date), at: Date.now() + date * 864e5 }; };
    var rposts = [P('p1', 'r-gyeonggi-s', 'notice', '11월 모임 장소가 바뀌었어요', '학교 공사 때문에 도서실로 옮겨요. 주차는 운동장 쪽이에요.', -2),
      P('p2', 'r-gyeonggi-s', 'log', '10월 모임 · 감정 체크인 데이터 읽기', '학급 감정 체크인 결과를 「도움이 필요한 신호」로 읽는 법을 나눴어요. 열두 분이 함께했어요.', -20),
      P('p3', 'r-gyeonggi-s', 'log', '9월 모임 · 학교자율시간 수업 나눔', '각자 2학기 학교자율시간 계획을 한 장씩 들고 와서 서로 다듬었어요.', -50),
      P('p4', 'r-seoul', 'notice', '12월은 송년 수업 나눔으로 해요', '한 해 동안 가장 좋았던 수업 하나씩 가져와 주세요.', -5)];
    var rlinks = [{ id: 'l1', region: 'r-gyeonggi-s', t: '10월 모임 자료 모음(견본)', u: 'https://example.com/quoka-10', at: Date.now() }];
    return { teams: teams, tfs: tfs, tasks: tasks, reqs: reqs, regions: regions, rposts: rposts, rlinks: rlinks, rsvp: [] };
  }

  // ── 41. 운영실 ─────────────────────────────────────────────────
  // <quoka-ops teams="planning training-team pr admin contest" divisions="ai-civic …" regions-href="regions.html#regions/{id}"></quoka-ops>
  // 운영진만 들어오는 페이지에 둔다. 팀마다 할 일 보드(할 일 · 하는 중 · 끝), 팀끼리 주고받는 요청함(받으면 받은 팀 할 일이 된다),
  // 프로젝트 TF 만들기 → 보드 → 마무리 한 줄(TF 발자취), 지역연구회 열기 신청 확인까지 한곳에서.
  // el.store = 저장소(없으면 QuokaKit.localStore()) · 이벤트: open-region(detail.id)
  class QuokaOps extends Base {
    connectedCallback() { ensureStyle(); if (!this._ready) { this._ready = true; var self = this; whenParsed(function () { self.init(); }); } }
    set store(s) { this._store = s; if (this._inited) this._sub(); }
    get store() { return this._store || kitStore(); }
    init() {
      var self = this; this._inited = true; this.classList.add('qk');
      var list = function (a, d) { return (self.getAttribute(a) || d.join(' ')).split(/\s+/).filter(Boolean); };
      this._teams = list('teams', OPS_TEAMS); this._divs = list('divisions', OPS_DIVS);
      this._D = { teams: [], tfs: [], tasks: [], reqs: [], regions: [] };
      this._view = 'home'; this._reqTab = 'in';
      this._me = kitMe();
      this._box = el('div', 'qk-ops'); this.appendChild(this._box);
      this._sheet = document.createElement('quoka-sheet'); this.appendChild(this._sheet);
      this._box.addEventListener('focusout', function () { if (self._dirty) setTimeout(function () { if (!busy(self._box)) self.render(); }, 0); });
      this._sub(); this.render();
    }
    _sub() {
      var self = this; (this._offs || []).forEach(function (f) { if (typeof f === 'function') f(); }); this._offs = [];
      Object.keys(this._D).forEach(function (c) { self._offs.push(self.store.list(c, function (arr) { self._D[c] = arr || []; self._later(); })); });
    }
    _later() { var self = this; if (this._t) return; this._t = setTimeout(function () { self._t = 0; self.render(); }, 30); }
    // ── 자료 ──
    _team(key) { return this._D.teams.filter(function (t) { return t.id === key; })[0] || { id: key, intro: TEAM_ROLE[key] || '', lead: '', members: [], memo: '' }; }
    _tf(id) { return this._D.tfs.filter(function (t) { return t.id === id; })[0]; }
    _name(key) { if (key === 'region') return '지역 선생님'; var g = findGroup(key); if (g) return g.name; var t = this._tf(key); return t ? t.name : key; }
    _short(key) { return this._name(key).replace(/ 분과$/, ''); }
    _ic(key) { return findGroup(key) ? key : key === 'region' ? 'regional' : 'tf'; }
    _people(key) { var t = this._tf(key); if (t) return t.members || []; var m = this._team(key); return [m.lead].concat(m.members || []).filter(Boolean); }
    _tasks(key) { return this._D.tasks.filter(function (k) { return k.team === key; }); }
    _activeTfs() { return this._D.tfs.filter(function (t) { return t.status !== 'done'; }).sort(function (a, b) { return String(a.end).localeCompare(String(b.end)); }); }
    _myTeam() { return this._me && this._me.team; }
    _weekDue() { return this._D.tasks.filter(function (k) { var n = dleft(k.due); return k.st !== 'done' && n != null && n <= 7; }).sort(function (a, b) { return String(a.due).localeCompare(String(b.due)); }); }
    _inbox() { var mt = this._myTeam(); return this._D.reqs.filter(function (q) { return q.st === 'new' && (!mt || q.to === mt); }); }
    _cap(key) { var g = findGroup(key); return g && g.type === '분과' ? 3 : 4; }
    go(view) { this._view = view; this.render(); var b = this._box.querySelector('.qo-main'); if (b && b.getBoundingClientRect().top < 0) b.scrollIntoView({ block: 'start' }); }
    // ── 그리기 ──
    render() {
      if (!this._box) return;
      if (busy(this._box)) { this._dirty = true; return; }
      this._dirty = false;
      var self = this, b = this._box, D = this._D, v = this._view;
      b.innerHTML = '';
      var top = el('div', 'qo-top');
      top.innerHTML = '<div class="tt"><h3>운영실</h3><p>운영팀 · TF · 분과 · 지역연구회 일을 한곳에서 나눠 맡아요</p></div>';
      var meb = el('button', 'qo-me'); meb.type = 'button';
      if (this._me) { meb.innerHTML = faceTag(this._me.name, 28) + '<span><b></b><small></small></span><i>바꾸기</i>'; txt(meb, 'b', this._me.name); txt(meb, 'small', this._me.team ? this._short(this._me.team) : '소속 없음'); }
      else meb.innerHTML = '<span><b>나 정하기</b><small>닉네임 · 소속</small></span>';
      meb.addEventListener('click', function () { self.setup(); });
      top.appendChild(meb); b.appendChild(top);
      // 한 줄 요약
      var wk = this._weekDue(), inb = this._inbox(), tfs = this._activeTfs(), prep = D.regions.filter(function (r) { return r.status === 'prep'; });
      var sum = el('div', 'qo-sum');
      [['home', '이번 주 마감', wk.length, wk.some(function (k) { return dleft(k.due) < 0; }) ? 'late' : ''], ['inbox', this._myTeam() ? '우리 팀이 받은 요청' : '새 요청', inb.length, inb.length ? 'new' : ''],
        ['tfs', '움직이는 TF', tfs.length, ''], ['regions', '문 여는 지역연구회', prep.length, prep.length ? 'new' : '']].forEach(function (s) {
        var c = el('button', 'qo-chip ' + s[3], '<b>' + s[2] + '</b><span>' + s[1] + '</span>'); c.type = 'button';
        c.addEventListener('click', function () { if (s[0] === 'inbox') { self._reqTab = 'in'; self.go('home'); } else if (s[0] === 'tfs') self.go(tfs[0] ? tfs[0].id : 'tfnew'); else self.go(s[0]); });
        sum.appendChild(c);
      });
      b.appendChild(sum);
      var body = el('div', 'qo-body'), rail = el('nav', 'qo-rail'), main = el('div', 'qo-main');
      rail.setAttribute('aria-label', '운영실 메뉴');
      var item = function (key, label, ic, count, cls) {
        var x = el('button', 'qo-ri' + (v === key ? ' on' : '') + (cls ? ' ' + cls : ''), (ic ? icon(ic, 26) : '<span class="pl">+</span>') + '<span class="nm"></span>' + (count ? '<em>' + count + '</em>' : ''));
        x.type = 'button'; txt(x, '.nm', label); if (v === key) x.setAttribute('aria-current', 'page');
        x.addEventListener('click', function () { if (key === 'tfnew') self.editTf(); else self.go(key); });
        rail.appendChild(x);
      };
      var head = function (t) { rail.appendChild(el('p', 'qo-rh', t)); };
      var open = function (key) { return self._tasks(key).filter(function (k) { return k.st !== 'done'; }).length + D.reqs.filter(function (q) { return q.to === key && q.st === 'new'; }).length; };
      item('home', '한눈에', 'home', 0);
      head('운영팀'); this._teams.forEach(function (k) { item(k, self._short(k), k, open(k)); });
      head('프로젝트 TF'); tfs.forEach(function (t) { item(t.id, t.name, 'tf', open(t.id), 'tfi tone-' + (t.tone || 'pink')); });
      item('tfnew', 'TF 만들기', null, 0, 'add');
      if (D.tfs.some(function (t) { return t.status === 'done'; })) item('tfdone', 'TF 발자취', 'bookmark', 0);
      head('연구 분과'); this._divs.forEach(function (k) { item(k, self._short(k), k, open(k)); });
      head('지역'); item('regions', '지역연구회', 'regional', prep.length, prep.length ? 'hot' : '');
      body.appendChild(rail); body.appendChild(main); b.appendChild(body);
      var on = rail.querySelector('.on'); // 휴대폰처럼 메뉴가 옆으로 흐를 때 고른 칸이 보이게
      if (on && rail.scrollWidth > rail.clientWidth + 4) rail.scrollLeft += on.getBoundingClientRect().left - rail.getBoundingClientRect().left - 24;
      if (v === 'home') this._home(main);
      else if (v === 'regions') this._regions(main);
      else if (v === 'tfdone') this._tfDone(main);
      else this._board(main, v);
    }
    _home(main) {
      var self = this, D = this._D;
      var g = el('div', 'qo-grid2');
      // 이번 주 마감
      var due = el('section', 'qo-card qo-due', '<div class="hd"><h4>이번 주 마감</h4><small>지난 일 · 7일 안</small></div><ul></ul>');
      var ul = due.querySelector('ul'), wk = this._weekDue();
      if (!wk.length) ul.innerHTML = '<li class="empty">이번 주엔 급한 일이 없어요</li>';
      wk.slice(0, 8).forEach(function (k) {
        var li = el('li', '', icon(self._ic(k.team), 22) + '<button type="button" class="t"></button><span class="w"></span><span class="dd ' + dcls(k.due) + '"></span>');
        txt(li, '.t', k.title); txt(li, '.w', (k.who || '') + ' · ' + self._short(k.team)); txt(li, '.dd', dlabel(k.due));
        li.querySelector('.t').addEventListener('click', function () { self.editTask(k); });
        ul.appendChild(li);
      });
      g.appendChild(due);
      // 요청함
      var rq = el('section', 'qo-card qo-reqs', '<div class="hd"><h4>요청함</h4><div class="tabs" role="tablist"></div><button type="button" class="qk-gbtn send">요청 보내기</button></div><div class="list"></div>');
      var mt = this._myTeam(), tabs = rq.querySelector('.tabs');
      [['in', mt ? '받은' : '새 요청'], ['out', '보낸'], ['all', '전체']].forEach(function (t) {
        if (!mt && t[0] === 'out') return;
        var x = el('button', 'qo-tab', t[1]); x.type = 'button'; x.setAttribute('role', 'tab'); x.setAttribute('aria-selected', String(self._reqTab === t[0]));
        x.addEventListener('click', function () { self._reqTab = t[0]; self.render(); }); tabs.appendChild(x);
      });
      rq.querySelector('.send').addEventListener('click', function () { self.sendReq(); });
      var tab = this._reqTab, rs = D.reqs.filter(function (q) {
        if (tab === 'in') return mt ? q.to === mt && q.st !== 'done' : q.st === 'new';
        if (tab === 'out') return q.from === mt && q.st !== 'done';
        return true;
      }).sort(function (a, b) { return (a.st === 'done') - (b.st === 'done') || b.at - a.at; }).slice(0, 12);
      var rl = rq.querySelector('.list');
      if (!rs.length) rl.innerHTML = '<p class="empty">' + (tab === 'out' ? '보낸 요청이 없어요' : '쌓인 요청이 없어요. 다른 팀 손이 필요하면 「요청 보내기」') + '</p>';
      rs.forEach(function (q) { rl.appendChild(self._reqCard(q)); });
      g.appendChild(rq);
      main.appendChild(g);
      // 팀 한눈에
      var tg = el('section', 'qo-teams', '<div class="hd"><h4>팀 한눈에</h4><small>할 일 · 하는 중 · 끝</small></div><div class="grid"></div>'), grid = tg.querySelector('.grid');
      this._teams.concat(this._activeTfs().map(function (t) { return t.id; })).forEach(function (k) {
        var ks = self._tasks(k), n = { todo: 0, doing: 0, done: 0 }; ks.forEach(function (x) { n[x.st] = (n[x.st] || 0) + 1; });
        var tot = ks.length || 1, tf = self._tf(k), ppl = self._people(k);
        var c = el('button', 'qo-tcard' + (tf ? ' tf tone-' + (tf.tone || 'pink') : ''), icon(self._ic(k), 34) + '<span class="tx"><b></b><small></small></span>' +
          '<span class="bar" aria-hidden="true"><i style="width:' + (n.done / tot * 100) + '%"></i><i class="dg" style="width:' + (n.doing / tot * 100) + '%"></i></span>' +
          '<span class="ct"><span>할 일 ' + n.todo + '</span><span>하는 중 ' + n.doing + '</span><span>끝 ' + n.done + '</span></span>');
        c.type = 'button'; txt(c, 'b', self._short(k));
        txt(c, 'small', tf ? (tf.end ? '~' + mday(tf.end) + ' · ' : '') + ppl.length + '명' : (ppl[0] ? '팀장 ' + ppl[0] : '팀장을 정해 주세요') + (ppl.length < self._cap(k) ? ' · 함께할 선생님 찾는 중' : ''));
        c.addEventListener('click', function () { self.go(k); });
        grid.appendChild(c);
      });
      main.appendChild(tg);
    }
    _reqCard(q) {
      var self = this, K = OPS_KIND[q.kind] || OPS_KIND.etc, mt = this._myTeam();
      var c = el('article', 'qo-req st-' + q.st + (q.to === mt ? ' mine' : ''),
        '<div class="h"><span class="kind tone-' + K[1] + '"></span><span class="ft"></span>' + (q.due ? '<span class="dd ' + dcls(q.due) + '"></span>' : '') + '</div><b class="t"></b><p class="bd"></p><div class="a"><span class="by"></span><span class="sp"></span></div>');
      txt(c, '.kind', K[0]); txt(c, '.ft', this._short(q.from) + ' → ' + this._short(q.to)); if (q.due) txt(c, '.dd', dlabel(q.due));
      txt(c, '.t', q.title); txt(c, '.bd', q.body || ''); if (!q.body) c.querySelector('.bd').remove();
      txt(c, '.by', (q.by || '') + ' · ' + relDay(vday(q.at), parseDay(new Date())) + ' · ' + { new: '새 요청', ok: '받아서 하는 중', done: '끝' }[q.st]);
      var a = c.querySelector('.a'), btn = function (label, cls, fn) { var x = el('button', 'qk-gbtn ' + (cls || ''), label); x.type = 'button'; x.addEventListener('click', fn); a.appendChild(x); };
      if (q.kind === 'region' && q.st !== 'done') { btn('지역 페이지 보기', '', function () { self._openRegion(q.region); }); btn('문 열어 주기', 'go', function () { self.openRegion(q.region, q); }); }
      else if (q.st === 'new') btn('받기', 'go', function () { self.acceptReq(q); });
      else if (q.st === 'ok') btn('끝냈어요', 'go', function () { self.doneReq(q); });
      return c;
    }
    acceptReq(q) {
      var S = this.store, who = this._me && this._people(q.to).indexOf(this._me.name) >= 0 ? this._me.name : (this._people(q.to)[0] || '');
      S.put('reqs', Object.assign({}, q, { st: 'ok', took: who }));
      S.put('tasks', { id: uid('k'), team: q.to, title: q.title, who: who, due: q.due || '', st: 'todo', req: q.id, memo: q.body || '', at: Date.now() });
      toast(this._short(q.to) + ' 할 일로 옮겼어요', { mood: 'happy' });
    }
    doneReq(q) {
      var S = this.store; S.put('reqs', Object.assign({}, q, { st: 'done', doneAt: Date.now() }));
      this._D.tasks.filter(function (k) { return k.req === q.id && k.st !== 'done'; }).forEach(function (k) { S.put('tasks', Object.assign({}, k, { st: 'done' })); });
      toast('요청을 끝냈어요. ' + this._short(q.from) + '에도 보여요', { mood: 'happy' });
    }
    openRegion(id, q) {
      var S = this.store, r = this._D.regions.filter(function (x) { return x.id === id; })[0];
      if (r) S.put('regions', Object.assign({}, r, { status: 'open', openedAt: Date.now() }));
      (q ? [q] : this._D.reqs.filter(function (x) { return x.region === id && x.st !== 'done'; })).forEach(function (x) { S.put('reqs', Object.assign({}, x, { st: 'done', doneAt: Date.now() })); });
      toast((r ? r.name : '지역연구회') + ' 문을 열었어요!', { mood: 'excited' });
    }
    _openRegion(id) {
      this.dispatchEvent(new CustomEvent('open-region', { detail: { id: id }, bubbles: true }));
      var h = this.getAttribute('regions-href'); if (h) location.href = h.replace('{id}', encodeURIComponent(id));
    }
    _board(main, key) {
      var self = this, tf = this._tf(key), isTeam = !!findGroup(key);
      if (!tf && !isTeam) { this._view = 'home'; return this._home(main); }
      var T = isTeam ? this._team(key) : null, ppl = this._people(key);
      var hd = el('section', 'qo-head' + (tf ? ' tf tone-' + (tf.tone || 'pink') : ''), icon(this._ic(key), 48) + '<div class="tx"><h4></h4><p class="in"></p><div class="ppl"></div></div><div class="ac"></div>');
      txt(hd, 'h4', this._name(key)); txt(hd, '.in', tf ? tf.goal : T.intro || TEAM_ROLE[key] || '');
      var pp = hd.querySelector('.ppl');
      ppl.forEach(function (n, i) { var s = el('span', 'p' + (i === 0 && isTeam ? ' lead' : ''), faceTag(n, 24) + '<span></span>'); txt(s, 'span', n + (i === 0 && isTeam ? ' · 팀장' : '')); pp.appendChild(s); });
      if (isTeam && ppl.length < this._cap(key)) pp.appendChild(el('span', 'p want', '함께할 선생님 ' + (this._cap(key) - ppl.length) + '자리'));
      var ac = hd.querySelector('.ac'), btn = function (label, fn, cls) { var x = el('button', 'qk-gbtn ' + (cls || ''), label); x.type = 'button'; x.addEventListener('click', fn); ac.appendChild(x); };
      if (tf) {
        var s = parseDay(tf.start), e = parseDay(tf.end), now = parseDay(new Date()), pct = s && e && e > s ? Math.max(0, Math.min(100, (now - s) / (e - s) * 100)) : 0;
        var per = el('div', 'qo-period', '<span class="r"></span><span class="bar"><i style="width:' + pct + '%"></i></span><span class="l"></span>');
        txt(per, '.r', mday(tf.start) + ' ~ ' + mday(tf.end)); txt(per, '.l', dleft(tf.end) >= 0 ? dleft(tf.end) + '일 남음' : '기간이 지났어요');
        hd.querySelector('.tx').appendChild(per);
        btn('고치기', function () { self.editTf(tf); }); btn('마무리하기', function () { self.closeTf(tf); }, 'go');
      } else {
        if (T.memo) { var m = el('p', 'memo'); txt(m, null, T.memo); hd.querySelector('.tx').appendChild(m); }
        btn('팀 고치기', function () { self.editTeam(key); });
      }
      btn('요청 보내기', function () { self.sendReq(null, key); });
      main.appendChild(hd);
      // 이 팀이 받은 요청
      var inq = this._D.reqs.filter(function (q) { return q.to === key && q.st === 'new'; });
      if (inq.length) { var st = el('section', 'qo-inq', '<p class="h">받은 요청 ' + inq.length + '</p><div class="list"></div>'); inq.forEach(function (q) { st.querySelector('.list').appendChild(self._reqCard(q)); }); main.appendChild(st); }
      // 보드
      var bd = el('div', 'qo-board'), ks = this._tasks(key);
      OPS_COL.forEach(function (col, ci) {
        var items = ks.filter(function (k) { return (k.st || 'todo') === col[0]; }).sort(function (a, b) { return col[0] === 'done' ? b.at - a.at : String(a.due || '9').localeCompare(String(b.due || '9')) || a.at - b.at; });
        var c = el('section', 'qo-col c-' + col[0], '<div class="ch"><b>' + col[1] + '</b><em>' + items.length + '</em></div><div class="cl"></div>');
        c.setAttribute('aria-label', col[1]);
        var cl = c.querySelector('.cl');
        if (col[0] === 'todo') {
          var f = el('form', 'qo-add', '<input maxlength="60" placeholder="할 일 더하기 (Enter)" aria-label="할 일 더하기"><button type="submit" aria-label="더하기">+</button>');
          f.addEventListener('submit', function (e) {
            e.preventDefault(); var i = f.querySelector('input'), t = i.value.trim().slice(0, 60); if (!t) return; i.value = ''; i.blur();
            var who = self._me && ppl.indexOf(self._me.name) >= 0 ? self._me.name : '';
            self.store.put('tasks', { id: uid('k'), team: key, title: t, who: who, due: '', st: 'todo', req: '', at: Date.now() });
            setTimeout(function () { var ni = self._box.querySelector('.qo-add input'); if (ni) ni.focus(); }, 80);
          });
          cl.appendChild(f);
        }
        (col[0] === 'done' ? items.slice(0, 10) : items).forEach(function (k) { cl.appendChild(self._taskCard(k, ci)); });
        if (!items.length && col[0] !== 'todo') cl.appendChild(el('p', 'empty', col[0] === 'doing' ? '하는 중인 일이 없어요' : '끝낸 일이 여기 모여요'));
        bd.appendChild(c);
      });
      main.appendChild(bd);
    }
    _taskCard(k, ci) {
      var self = this, c = el('article', 'qo-task' + (k.st === 'done' ? ' done' : ''),
        '<button type="button" class="t"></button><div class="m">' + (k.who ? faceTag(k.who, 20) + '<span class="w"></span>' : '<span class="w none">담당 없음</span>') +
        (k.due && k.st !== 'done' ? '<span class="dd ' + dcls(k.due) + '"></span>' : '') + (k.req ? '<span class="rq">요청</span>' : '') + '</div>' +
        '<div class="mv">' + (ci > 0 ? '<button type="button" class="pv" aria-label="' + OPS_COL[ci - 1][1] + '(으)로">‹</button>' : '') + (ci < 2 ? '<button type="button" class="nx" aria-label="' + OPS_COL[ci + 1][1] + '(으)로">' + (ci === 1 ? '✓' : '›') + '</button>' : '') + '</div>');
      txt(c, '.t', k.title); if (k.who) txt(c, '.w', k.who); if (k.due && k.st !== 'done') txt(c, '.dd', dlabel(k.due));
      c.querySelector('.t').addEventListener('click', function () { self.editTask(k); });
      var mv = function (d) { self.moveTask(k, OPS_COL[ci + d][0]); };
      if (c.querySelector('.pv')) c.querySelector('.pv').addEventListener('click', function () { mv(-1); });
      if (c.querySelector('.nx')) c.querySelector('.nx').addEventListener('click', function () { mv(1); });
      return c;
    }
    moveTask(k, st) {
      var S = this.store; S.put('tasks', Object.assign({}, k, { st: st, at: st === 'done' ? Date.now() : k.at }));
      if (st === 'done' && k.req) { var q = this._D.reqs.filter(function (x) { return x.id === k.req; })[0]; if (q && q.st !== 'done') { S.put('reqs', Object.assign({}, q, { st: 'done', doneAt: Date.now() })); toast('요청한 팀에도 「끝」으로 보여요', { mood: 'happy', time: 2200 }); } }
    }
    editTask(k) {
      var self = this, ppl = this._people(k.team), opts = opt('', '정하지 않음', k.who || '');
      ppl.concat(this._me && ppl.indexOf(this._me.name) < 0 ? [this._me.name] : []).forEach(function (n) { opts += opt(n, n, k.who); });
      if (k.who && ppl.indexOf(k.who) < 0 && !(this._me && this._me.name === k.who)) opts += opt(k.who, k.who, k.who);
      var f = sheetForm(this._sheet, this._short(k.team) + ' · 할 일', 'think',
        fld('할 일', '<input name="t" maxlength="60" required>') + '<div class="qo-2">' + fld('담당', '<select name="w">' + opts + '</select>') + fld('마감', '<input type="date" name="d">') + '</div>' +
        fld('어디까지', '<select name="s">' + OPS_COL.map(function (c) { return opt(c[0], c[1], k.st); }).join('') + '</select>') + fld('메모', '<textarea name="m" rows="3" maxlength="300"></textarea>') +
        '<div class="qo-btns"><button type="button" class="qk-gbtn del">지우기</button><span class="sp"></span><button type="submit" class="qk-cta">저장</button></div>',
        function (f) {
          var t = f.elements.t.value.trim(); if (!t) return false;
          var n = Object.assign({}, k, { title: t.slice(0, 60), who: f.elements.w.value, due: f.elements.d.value || '', memo: f.elements.m.value.slice(0, 300) });
          if (f.elements.s.value !== k.st) { self.moveTask(n, f.elements.s.value); } else self.store.put('tasks', n);
        });
      f.elements.t.value = k.title || ''; f.elements.d.value = k.due || ''; f.elements.m.value = k.memo || '';
      f.querySelector('.del').addEventListener('click', function () { self.store.del('tasks', k.id); self._sheet.close(); toast('지웠어요', { mood: 'calm', time: 1600 }); });
    }
    editTeam(key) {
      var self = this, T = this._team(key);
      var f = sheetForm(this._sheet, this._name(key) + ' 고치기', 'happy',
        fld('한 줄 소개', '<input name="i" maxlength="60">') + fld('팀장', '<input name="l" maxlength="12" placeholder="닉네임">') +
        fld('팀원', '<input name="m" maxlength="120" placeholder="쉼표로 나눠 적어요 · 예: 구름쌤, 연필쌤">', '운영진 모집 기준: ' + (this._cap(key) === 3 ? '분과는 팀장 1 + 팀원 2' : '운영팀은 팀장 1 + 팀원 3')) +
        fld('팀 메모', '<input name="o" maxlength="60" placeholder="예: 회의는 둘째 주 화요일">') + '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">저장</button></div>',
        function (f) { self.store.put('teams', { id: key, intro: f.elements.i.value.trim().slice(0, 60), lead: f.elements.l.value.trim().slice(0, 12), members: names(f.elements.m.value), memo: f.elements.o.value.trim().slice(0, 60) }); toast('팀을 고쳤어요', { mood: 'happy', time: 1600 }); });
      f.elements.i.value = T.intro || TEAM_ROLE[key] || ''; f.elements.l.value = T.lead || ''; f.elements.m.value = (T.members || []).join(', '); f.elements.o.value = T.memo || '';
    }
    editTf(tf) {
      var self = this, isNew = !tf; tf = tf || { id: uid('tf'), name: '', goal: '', start: todayStr(), end: dayAdd(42), members: this._me ? [this._me.name] : [], tone: 'pink', status: 'on', at: Date.now() };
      var known = {}; this._D.teams.forEach(function (t) { [t.lead].concat(t.members || []).forEach(function (n) { if (n) known[n] = 1; }); });
      var f = sheetForm(this._sheet, isNew ? 'TF 만들기' : 'TF 고치기', 'idea',
        '<p class="qo-lead">TF는 프로젝트 하나를 위해 잠깐 모였다가, 끝나면 한 줄 남기고 흩어지는 팀이에요.</p>' +
        fld('TF 이름', '<input name="n" maxlength="30" required placeholder="예: 2027 신규 회원 모집 TF">') + fld('목표 한 줄', '<input name="g" maxlength="60" placeholder="무엇을 끝내면 마무리인가요?">') +
        '<div class="qo-2">' + fld('시작', '<input type="date" name="s" required>') + fld('끝', '<input type="date" name="e" required>') + '</div>' +
        fld('함께할 운영진', '<input name="m" maxlength="120" placeholder="쉼표로 나눠 적어요">', '<span class="qo-known"></span>') +
        '<fieldset class="qo-tone"><legend>색</legend>' + ['pink', 'mint', 'lavender'].map(function (t) { return '<label><input type="radio" name="c" value="' + t + '"' + (tf.tone === t ? ' checked' : '') + '><span class="sw tone-' + t + '"></span></label>'; }).join('') + '</fieldset>' +
        '<div class="qo-btns">' + (isNew ? '' : '<button type="button" class="qk-gbtn del">지우기</button>') + '<span class="sp"></span><button type="submit" class="qk-cta">' + (isNew ? '만들기' : '저장') + '</button></div>',
        function (f) {
          var n = f.elements.n.value.trim(); if (!n) return false;
          if (f.elements.e.value < f.elements.s.value) { toast('끝나는 날이 시작보다 앞이에요', { mood: 'worried' }); return false; }
          var c = f.querySelector('[name=c]:checked');
          var x = Object.assign({}, tf, { name: n.slice(0, 30), goal: f.elements.g.value.trim().slice(0, 60), start: f.elements.s.value, end: f.elements.e.value, members: names(f.elements.m.value), tone: c ? c.value : 'pink' });
          self.store.put('tfs', x); if (isNew) { self._view = x.id; toast(x.name + '를 만들었어요', { mood: 'excited' }); }
        });
      f.elements.n.value = tf.name; f.elements.g.value = tf.goal || ''; f.elements.s.value = tf.start; f.elements.e.value = tf.end; f.elements.m.value = (tf.members || []).join(', ');
      var kn = f.querySelector('.qo-known'); Object.keys(known).slice(0, 24).forEach(function (n) {
        var b = el('button', 'qo-nm', ''); b.type = 'button'; txt(b, null, '+ ' + n);
        b.addEventListener('click', function () { var cur = names(f.elements.m.value); if (cur.indexOf(n) < 0) cur.push(n); f.elements.m.value = cur.join(', '); });
        kn.appendChild(b);
      });
      if (!isNew) f.querySelector('.del').addEventListener('click', function () {
        self._D.tasks.filter(function (k) { return k.team === tf.id; }).forEach(function (k) { self.store.del('tasks', k.id); });
        self.store.del('tfs', tf.id); self._view = 'home'; self._sheet.close();
      });
    }
    closeTf(tf) {
      var self = this, ks = this._tasks(tf.id), left = ks.filter(function (k) { return k.st !== 'done'; }).length;
      var f = sheetForm(this._sheet, tf.name + ' 마무리', 'excited',
        '<p class="qo-lead">수고 많으셨어요! 무엇을 해냈는지 한 줄 남기면 「TF 발자취」에 오래 남아요.' + (left ? ' 아직 안 끝난 일 ' + left + '개는 그대로 기록돼요.' : '') + '</p>' +
        fld('해낸 일 한 줄', '<input name="r" maxlength="80" required placeholder="예: 신규 회원 132명 · 카드뉴스 3장 · 신청 폼">') + '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">마무리하기</button></div>',
        function (f) { self.store.put('tfs', Object.assign({}, tf, { status: 'done', result: f.elements.r.value.trim().slice(0, 80), doneAt: Date.now() })); self._view = 'tfdone'; toast('TF를 마무리했어요. 고마워요!', { mood: 'excited' }); });
    }
    _tfDone(main) {
      var self = this, done = this._D.tfs.filter(function (t) { return t.status === 'done'; }).sort(function (a, b) { return String(b.end).localeCompare(String(a.end)); });
      main.appendChild(el('div', 'qo-sec', '<h4>TF 발자취</h4><p>잠깐 모였다 흩어진 팀들이 남긴 한 줄이에요</p>'));
      var list = el('div', 'qo-trail');
      done.forEach(function (t) {
        var n = self._tasks(t.id).filter(function (k) { return k.st === 'done'; }).length;
        var c = el('article', 'qo-tfd tone-' + (t.tone || 'pink'), icon('tf', 34) + '<div class="tx"><b></b><small></small><p></p><div class="ppl"></div></div>');
        txt(c, 'b', t.name); txt(c, 'small', mday(t.start) + ' ~ ' + mday(t.end) + ' · 끝낸 일 ' + n + '개'); txt(c, 'p', t.result || '');
        (t.members || []).forEach(function (m) { var s = el('span', '', faceTag(m, 20)); s.title = m; c.querySelector('.ppl').appendChild(s); });
        list.appendChild(c);
      });
      if (!done.length) list.innerHTML = '<p class="empty">아직 마무리한 TF가 없어요</p>';
      main.appendChild(list);
    }
    _regions(main) {
      var self = this, rs = this._D.regions.slice().sort(function (a, b) { return (a.status === 'prep' ? 0 : 1) - (b.status === 'prep' ? 0 : 1) || String(a.name).localeCompare(String(b.name)); });
      main.appendChild(el('div', 'qo-sec', '<h4>지역연구회</h4><p>지역 선생님이 직접 신청해서 열어요. 신청이 오면 기획운영팀이 확인하고 문을 열어 줘요.</p>'));
      var list = el('div', 'qo-rlist');
      rs.forEach(function (r) {
        var sd = SIDO.filter(function (s) { return s[0] === r.sido; })[0];
        var c = el('article', 'qo-rg' + (r.status === 'prep' ? ' prep' : ''), '<img alt="" width="44" height="44"><div class="tx"><b></b><small></small></div><span class="st"></span><div class="a"></div>');
        c.querySelector('img').src = Q.url({ expression: r.status === 'prep' ? 'excited' : 'smile', accessory: [r.acc || 'bucket'] });
        txt(c, 'b', r.name); txt(c, 'small', (sd ? sd[1] + ' · ' : '') + '회장 ' + (r.pres || '-') + ' · 함께 ' + (r.members || 0) + '명');
        txt(c, '.st', r.status === 'prep' ? '문 여는 중' : '활동 중');
        var a = c.querySelector('.a'), b1 = el('button', 'qk-gbtn', '페이지 보기'); b1.type = 'button'; b1.addEventListener('click', function () { self._openRegion(r.id); }); a.appendChild(b1);
        if (r.status === 'prep') { var b2 = el('button', 'qk-gbtn go', '문 열어 주기'); b2.type = 'button'; b2.addEventListener('click', function () { self.openRegion(r.id); }); a.appendChild(b2); }
        list.appendChild(c);
      });
      if (!rs.length) list.innerHTML = '<p class="empty">아직 지역연구회가 없어요</p>';
      main.appendChild(list);
    }
    sendReq(to, from) {
      var self = this, mt = from || this._myTeam() || '', all = this._teams.concat(this._activeTfs().map(function (t) { return t.id; }), this._divs);
      var teamOpts = function (cur, blank) { return (blank ? opt('', blank, cur) : '') + all.map(function (k) { return opt(k, self._short(k), cur); }).join(''); };
      var f = sheetForm(this._sheet, '요청 보내기', 'idea',
        '<p class="qo-lead">다른 팀 손이 필요할 때 보내요. 받은 팀이 「받기」를 누르면 그 팀 할 일이 되고, 끝내면 여기서도 「끝」으로 보여요.</p>' +
        '<div class="qo-2">' + fld('보내는 팀', '<select name="f">' + teamOpts(mt, '팀 고르기') + '</select>') + fld('받는 팀', '<select name="t" required>' + teamOpts(to || '', '팀 고르기') + '</select>') + '</div>' +
        fld('어떤 일', '<select name="k">' + Object.keys(OPS_KIND).filter(function (k) { return k !== 'region'; }).map(function (k) { return opt(k, OPS_KIND[k][0], 'pr'); }).join('') + '</select>') +
        fld('제목', '<input name="n" maxlength="50" required placeholder="예: 겨울 연수 홍보 카드 1장">') + fld('자세히', '<textarea name="b" rows="3" maxlength="300" placeholder="크기 · 문구 · 꼭 들어갈 것"></textarea>') +
        fld('필요한 날', '<input type="date" name="d">') + '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">보내기</button></div>',
        function (f) {
          var t = f.elements.t.value, n = f.elements.n.value.trim(); if (!t || !n) { toast('받는 팀과 제목을 적어 주세요', { mood: 'worried' }); return false; }
          if (t === f.elements.f.value) { toast('보내는 팀과 받는 팀이 같아요', { mood: 'worried' }); return false; }
          self.store.put('reqs', { id: uid('q'), from: f.elements.f.value || 'planning', to: t, kind: f.elements.k.value, title: n.slice(0, 50), body: f.elements.b.value.trim().slice(0, 300), due: f.elements.d.value || '', st: 'new', by: self._me ? self._me.name : '', at: Date.now() });
          self._reqTab = 'out'; toast(self._short(t) + '에 보냈어요', { mood: 'happy' });
        });
    }
    setup() {
      var self = this, me = this._me || { name: '', team: '' };
      var f = sheetForm(this._sheet, '나 정하기', 'happy',
        '<p class="qo-lead">운영실에선 닉네임으로 불러요. 소속을 정하면 우리 팀이 받은 요청이 먼저 보여요.</p>' + fld('닉네임', '<input name="n" maxlength="10" required placeholder="예: 바람쌤">') +
        fld('소속', '<select name="t">' + opt('', '아직 없음', me.team) + '<optgroup label="운영팀">' + this._teams.map(function (k) { return opt(k, self._short(k), me.team); }).join('') + '</optgroup><optgroup label="연구 분과">' + this._divs.map(function (k) { return opt(k, self._short(k), me.team); }).join('') + '</optgroup></select>') +
        '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">저장</button></div>',
        function (f) { var n = f.elements.n.value.trim().slice(0, 10); if (!n) return false; self._me = { name: n, team: f.elements.t.value }; store('qk-me', JSON.stringify(self._me)); self._reqTab = 'in'; self.render(); });
      f.elements.n.value = me.name || '';
    }
  }

  // ── 42. 조직도(공개) ───────────────────────────────────────────
  // <quoka-org recruit regions-href="regions.html#regions/{id}"></quoka-org>
  // 운영실에서 고친 팀장·팀원 · TF · 지역연구회가 그대로 보인다(같은 저장소). recruit = 빈자리에 「함께할 선생님 찾는 중」
  class QuokaOrg extends Base {
    connectedCallback() { ensureStyle(); if (!this._ready) { this._ready = true; var self = this; whenParsed(function () { self.init(); }); } }
    set store(s) { this._store = s; if (this._inited) this._sub(); }
    get store() { return this._store || kitStore(); }
    init() { this._inited = true; this.classList.add('qk'); this._D = { teams: [], tfs: [], regions: [] }; this._box = el('div', 'qk-org'); this.appendChild(this._box); this._sub(); this.render(); }
    _sub() { var self = this; (this._offs || []).forEach(function (f) { if (typeof f === 'function') f(); }); this._offs = Object.keys(this._D).map(function (c) { return self.store.list(c, function (a) { self._D[c] = a || []; clearTimeout(self._t); self._t = setTimeout(function () { self.render(); }, 30); }); }); }
    render() {
      var self = this, D = this._D, b = this._box, rec = this.hasAttribute('recruit');
      var team = function (k) { return D.teams.filter(function (t) { return t.id === k; })[0] || {}; };
      b.innerHTML = '';
      var group = function (title, sub, keys, cap) {
        var s = el('section', 'qg-sec', '<div class="hd"><h4>' + title + '</h4><small>' + sub + '</small></div><div class="grid"></div>'), g = s.querySelector('.grid');
        keys.forEach(function (k) {
          var t = team(k), n = (t.lead ? 1 : 0) + (t.members || []).length;
          var c = el('article', 'qg-card', icon(k, 44) + '<div class="tx"><b></b><small class="r"></small><span class="ld"></span></div>');
          txt(c, 'b', findGroup(k).name); txt(c, '.r', t.intro || TEAM_ROLE[k] || '');
          var ld = c.querySelector('.ld');
          if (t.lead) { ld.innerHTML = faceTag(t.lead, 22) + '<span></span>'; txt(ld, 'span', '팀장 ' + t.lead + (n > 1 ? ' 외 ' + (n - 1) + '명' : '')); } else ld.textContent = '팀장을 기다려요';
          if (rec && n < cap) c.querySelector('.tx').appendChild(el('span', 'want', '함께할 선생님 찾는 중'));
          g.appendChild(c);
        });
        b.appendChild(s);
      };
      group('연구 분과', '분과 팀장 1 + 팀원 2', OPS_DIVS, 3);
      group('운영팀', '연구회 살림을 나눠 맡아요', OPS_TEAMS, 4);
      var tfs = D.tfs.filter(function (t) { return t.status !== 'done'; });
      var rs = D.regions.filter(function (r) { return r.status === 'open'; });
      var row = el('div', 'qg-row');
      var tsec = el('section', 'qg-sec qg-tf', '<div class="hd"><h4>지금 움직이는 TF</h4><small>프로젝트 하나를 위해 잠깐 모인 팀</small></div><div class="chips"></div>');
      tfs.forEach(function (t) { var c = el('span', 'qg-chip tone-' + (t.tone || 'pink'), icon('tf', 22) + '<b></b><small></small>'); txt(c, 'b', t.name); txt(c, 'small', '~' + mday(t.end)); tsec.querySelector('.chips').appendChild(c); });
      if (!tfs.length) tsec.querySelector('.chips').innerHTML = '<p class="empty">지금은 쉬는 중이에요</p>';
      row.appendChild(tsec);
      var rsec = el('section', 'qg-sec qg-rg', '<div class="hd"><h4>지역연구회 ' + rs.length + '곳</h4><small>가까운 선생님끼리 만나요</small></div><div class="chips"></div>');
      var href = this.getAttribute('regions-href');
      rs.forEach(function (r) {
        var c = el(href ? 'a' : 'span', 'qg-chip tone-' + (r.tone || 'mint'), '<img alt="" width="22" height="22"><b></b>');
        c.querySelector('img').src = Q.url({ expression: 'smile', accessory: [r.acc || 'bucket'] }); txt(c, 'b', r.name);
        if (href) c.href = href.replace('{id}', encodeURIComponent(r.id));
        rsec.querySelector('.chips').appendChild(c);
      });
      if (href) { var a = el('a', 'qg-chip add', '+ 우리 지역 열기'); a.href = href.replace(/\/?\{id\}/, ''); rsec.querySelector('.chips').appendChild(a); }
      row.appendChild(rsec);
      b.appendChild(row);
    }
  }

  // ── 43. 지역연구회 ─────────────────────────────────────────────
  // <quoka-regions hash="regions" apply-to="planning" demo></quoka-regions>
  // 지역연구회 모음(타일 지도 + 목록 + 「우리 지역에 쿼카 열기」 신청) → 지역 페이지(다음 모임 · 갈게요 · 공지 · 모임 기록 · 자료).
  // 지역 페이지는 그 지역 회장·부회장·간사가 고친다: el.canEdit = region => 로그인한 사람이 그 지역 임원인가
  // hash = 주소(#regions/지역id)와 맞춰 뒤로 가기가 된다 · demo = 「회장 화면으로 보기」 견본 단추 · 열기 신청은 운영실 요청함(apply-to 팀)으로 간다
  class QuokaRegions extends Base {
    connectedCallback() {
      ensureStyle(); var self = this;
      if (!this._ready) { this._ready = true; whenParsed(function () { self.init(); }); }
      else if (this._inited && this.getAttribute('hash') != null && !this._hc) { this._hc = function () { self._fromHash(); }; root.addEventListener('hashchange', this._hc); this._fromHash(); }
    }
    disconnectedCallback() { if (this._hc) { root.removeEventListener('hashchange', this._hc); this._hc = null; } }
    set store(s) { this._store = s; if (this._inited) this._sub(); }
    get store() { return this._store || kitStore(); }
    set canEdit(fn) { this._canEdit = fn; if (this._inited) this.render(); }
    get canEdit() { return this._canEdit; }
    init() {
      var self = this; this._inited = true; this.classList.add('qk');
      this._D = { regions: [], rposts: [], rlinks: [], rsvp: [] };
      this._open = null; this._sido = null; this._demoEdit = false;
      this._box = el('div', 'qk-rg'); this.appendChild(this._box);
      this._sheet = document.createElement('quoka-sheet'); this.appendChild(this._sheet);
      this._box.addEventListener('focusout', function () { if (self._dirty) setTimeout(function () { if (!busy(self._box)) self.render(); }, 0); });
      var hp = this.getAttribute('hash');
      if (hp != null) {
        this._hc = function () { self._fromHash(); }; root.addEventListener('hashchange', this._hc); this._fromHash(true);
      }
      this._sub(); this.render();
    }
    _fromHash(first) {
      var hp = this.getAttribute('hash') || 'regions', h = decodeURIComponent(location.hash.slice(1)), m = h.indexOf(hp + '/') === 0 ? h.slice(hp.length + 1) : null;
      if (h !== hp && m == null && !first) return;
      if ((m || null) !== this._open) { this._open = m || null; this._demoEdit = false; if (!first) { this.render(); this.scrollIntoView({ block: 'start' }); } }
    }
    _sub() { var self = this; (this._offs || []).forEach(function (f) { if (typeof f === 'function') f(); }); this._offs = Object.keys(this._D).map(function (c) { return self.store.list(c, function (a) { self._D[c] = a || []; clearTimeout(self._t); self._t = setTimeout(function () { self.render(); }, 30); }); }); }
    show(id) { // 지역 페이지 열기(id 없으면 모음으로)
      var hp = this.getAttribute('hash');
      if (hp != null) { location.hash = id ? hp + '/' + encodeURIComponent(id) : hp; return; }
      this._open = id || null; this._demoEdit = false; this.render(); this.scrollIntoView({ block: 'start' });
    }
    _region(id) { return this._D.regions.filter(function (r) { return r.id === id; })[0]; }
    _can(r) { if (!r) return false; if (this._demoEdit) return true; return typeof this._canEdit === 'function' ? !!this._canEdit(r) : false; }
    render() {
      if (!this._box) return;
      if (busy(this._box)) { this._dirty = true; return; }
      this._dirty = false; this._box.innerHTML = '';
      var r = this._open && this._region(this._open);
      if (this._open && !r) { this._box.appendChild(el('p', 'qr-empty', this._D.regions.length ? '이 지역연구회를 찾지 못했어요' : '불러오는 중…')); var self = this, bk = el('button', 'qk-gbtn', '지역연구회 모두 보기'); bk.type = 'button'; bk.addEventListener('click', function () { self.show(null); }); this._box.appendChild(bk); return; }
      if (r) this._page(r); else this._hub();
    }
    _hub() {
      var self = this, b = this._box, D = this._D, open = D.regions.filter(function (r) { return r.status === 'open'; }), prep = D.regions.filter(function (r) { return r.status === 'prep'; });
      var ppl = open.reduce(function (s, r) { return s + (+r.members || 0); }, 0);
      var hero = el('div', 'qr-hero', '<div class="tx"><p class="eb">Q.U.O.K.A · 지역연구회</p><h2>가까운 선생님끼리,<br>우리 동네 쿼카</h2><p>온라인으로 만나던 선생님들이 같은 지역에서 얼굴 보고 수업을 나눠요. 우리 지역이 아직 없다면, 직접 열 수 있어요.</p>' +
        '<div class="st"><span><b>' + open.length + '</b>곳 활동 중</span><span><b>' + prep.length + '</b>곳 문 여는 중</span><span><b>' + ppl + '</b>명이 함께</span></div><button type="button" class="qk-cta go">우리 지역에 쿼카 열기</button></div>');
      hero.querySelector('.go').addEventListener('click', function () { self.apply(self._sido); });
      var art = el('div', 'art'); art.setAttribute('aria-hidden', 'true');
      open.map(function (r) { return [r.acc, r.tone]; }).concat([['pom-beanie', 'pink'], ['beret', 'lavender'], ['cap', 'mint'], ['bucket', 'mint'], ['headphones', 'pink']]).slice(0, 5).forEach(function (a, i) {
        var f = el('span', 'f f' + i + ' tone-' + (a[1] || 'mint'), '<img alt="" width="96" height="96">');
        f.querySelector('img').src = Q.url({ expression: ['happy', 'smile', 'excited', 'smile', 'calm'][i], accessory: [a[0] || 'bucket'] }); art.appendChild(f);
      });
      hero.appendChild(art);
      b.appendChild(hero);
      var wrap = el('div', 'qr-hub'), map = el('div', 'qr-map'), grid = el('div', 'qr-tiles');
      grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', '지역 지도');
      SIDO.forEach(function (s) {
        var rs = D.regions.filter(function (r) { return r.sido === s[0]; }), on = rs.filter(function (r) { return r.status === 'open'; }), pr = rs.length && !on.length;
        var t = el('button', 'qr-tile' + (on.length ? ' on tone-' + (on[0].tone || 'mint') : pr ? ' prep' : '') + (self._sido === s[0] ? ' sel' : ''), '<b>' + s[1] + '</b>' + (on.length ? '<img alt="" width="26" height="26"><small>' + on.length + '곳</small>' : pr ? '<small>여는 중</small>' : '<small class="pl">+</small>'));
        t.type = 'button'; t.style.gridColumn = s[2] + 1; t.style.gridRow = s[3] + 1;
        if (on.length) t.querySelector('img').src = Q.url({ expression: 'smile', accessory: [on[0].acc || 'bucket'] });
        t.setAttribute('aria-label', s[1] + (on.length ? ' · 지역연구회 ' + on.length + '곳' : pr ? ' · 문 여는 중' : ' · 아직 없어요, 열기 신청'));
        t.addEventListener('click', function () { if (!rs.length) self.apply(s[0]); else { self._sido = self._sido === s[0] ? null : s[0]; self.render(); } });
        grid.appendChild(t);
      });
      map.appendChild(grid);
      map.appendChild(el('p', 'qr-legend', '<span class="k on"></span>활동 중 <span class="k prep"></span>문 여는 중 <span class="k"></span>아직 없어요 · 누르면 열기 신청'));
      wrap.appendChild(map);
      var side = el('div', 'qr-list'), sd = this._sido && SIDO.filter(function (s) { return s[0] === self._sido; })[0];
      var lh = el('div', 'qr-lh', '<h3></h3>'); txt(lh, 'h3', sd ? sd[1] + ' 지역연구회' : '모든 지역연구회');
      if (sd) { var clr = el('button', 'qk-gbtn', '전체 보기'); clr.type = 'button'; clr.addEventListener('click', function () { self._sido = null; self.render(); }); lh.appendChild(clr); }
      side.appendChild(lh);
      var rs = D.regions.filter(function (r) { return !self._sido || r.sido === self._sido; }).sort(function (a, b) { return (a.status === 'prep') - (b.status === 'prep') || (+b.members || 0) - (+a.members || 0); });
      rs.forEach(function (r) { side.appendChild(self._card(r)); });
      if (!rs.length) side.appendChild(el('p', 'qr-empty', '아직 지역연구회가 없어요. 첫 문을 열어 주세요!'));
      var cta = el('button', 'qr-open', '<b>우리 지역이 없나요?</b><span>지역 선생님이 직접 신청해서 열어요 · 회장 1 + 간사 1이면 시작할 수 있어요</span>'); cta.type = 'button';
      cta.addEventListener('click', function () { self.apply(self._sido); });
      side.appendChild(cta);
      wrap.appendChild(side); b.appendChild(wrap);
    }
    _card(r) {
      var self = this, sd = SIDO.filter(function (s) { return s[0] === r.sido; })[0], n = r.next && dleft(r.next.date) >= 0 ? r.next : null;
      var c = el('button', 'qr-card tone-' + (r.tone || 'mint') + (r.status === 'prep' ? ' prep' : ''), '<img alt="" width="56" height="56"><span class="tx"><span class="t"><b></b><em></em></span><small class="i"></small><span class="nx"></span></span>');
      c.type = 'button'; c.querySelector('img').src = Q.url({ expression: r.status === 'prep' ? 'excited' : 'smile', accessory: [r.acc || 'bucket'] });
      txt(c, 'b', r.name); txt(c, 'em', r.status === 'prep' ? '문 여는 중' : (sd ? sd[1] : '')); txt(c, '.i', '회장 ' + (r.pres || '-') + ' · 함께 ' + (+r.members || 0) + '명');
      txt(c, '.nx', n ? '다음 모임 ' + longDay(n.date) + ' · ' + dlabel(n.date) : r.status === 'prep' ? '기획운영팀이 확인하고 있어요' : '다음 모임을 준비하고 있어요');
      c.addEventListener('click', function () { self.show(r.id); });
      return c;
    }
    _page(r) {
      var self = this, b = this._box, D = this._D, can = this._can(r), sd = SIDO.filter(function (s) { return s[0] === r.sido; })[0];
      var bar = el('div', 'qr-bar'), back = el('button', 'qr-back', ARROW_L + '<span>지역연구회 모두</span>'); back.type = 'button';
      back.addEventListener('click', function () { self.show(null); }); bar.appendChild(back);
      if (this.hasAttribute('demo')) {
        var dm = el('button', 'qr-demo', this._demoEdit ? '회원 화면으로 보기' : '회장 화면으로 보기 (견본)'); dm.type = 'button'; dm.setAttribute('aria-pressed', String(this._demoEdit));
        dm.addEventListener('click', function () { self._demoEdit = !self._demoEdit; self.render(); }); bar.appendChild(dm);
      }
      b.appendChild(bar);
      if (r.status === 'prep') b.appendChild(el('p', 'qr-prep', '문 여는 중이에요 · 기획운영팀이 신청을 확인하면 지역연구회 모음에 「활동 중」으로 보여요'));
      var head = el('section', 'qr-head tone-' + (r.tone || 'mint'), '<div class="fc"><img alt="" width="132" height="132"></div><div class="tx"><p class="eb"></p><h2></h2><p class="in"></p><div class="off"></div></div><div class="nums"><span><b></b>함께하는 선생님</span><span><b></b>모임 기록</span></div>');
      head.querySelector('img').src = Q.url({ expression: 'happy', accessory: [r.acc || 'bucket'] });
      txt(head, '.eb', (sd ? sd[1] : '') + ' · ' + (r.status === 'prep' ? '문 여는 중' : '활동 중')); txt(head, 'h2', r.name); txt(head, '.in', r.intro || '');
      var off = head.querySelector('.off');
      [['회장', r.pres], ['부회장', r.vice], ['간사', r.sec]].forEach(function (o) { if (!o[1]) return; var s = el('span', '', faceTag(o[1], 26) + '<span><small></small><b></b></span>'); txt(s, 'small', o[0]); txt(s, 'b', o[1]); off.appendChild(s); });
      var logs = D.rposts.filter(function (p) { return p.region === r.id && p.kind === 'log'; }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      var nums = head.querySelectorAll('.nums b'); nums[0].textContent = (+r.members || 0); nums[1].textContent = logs.length;
      if (can) { var eb = el('button', 'qk-gbtn edit', '페이지 고치기'); eb.type = 'button'; eb.addEventListener('click', function () { self.editRegion(r); }); head.querySelector('.tx').appendChild(eb); }
      b.appendChild(head);
      var cols = el('div', 'qr-cols'), L = el('div', 'qr-l'), R = el('div', 'qr-r');
      // 다음 모임
      var n = r.next && dleft(r.next.date) >= -1 ? r.next : null, nx = el('section', 'qr-next' + (n ? '' : ' none'));
      if (n) {
        var mine = this._me(), rs = D.rsvp.filter(function (x) { return x.region === r.id && x.date === n.date; }), going = mine && rs.some(function (x) { return x.n === mine; });
        nx.innerHTML = '<div class="dt"><small></small><b></b><span class="dd"></span></div><div class="tx"><p class="h">다음 모임</p><h3></h3><p class="w"></p><div class="go"><button type="button" class="qk-cta rsvp"></button><span class="who"></span></div></div>';
        var d = parseDay(n.date); txt(nx, '.dt small', d ? (d.getMonth() + 1) + '월' : ''); txt(nx, '.dt b', d ? d.getDate() : ''); txt(nx, '.dd', dlabel(n.date));
        txt(nx, 'h3', n.topic || '주제를 곧 알려 드려요'); txt(nx, '.w', longDay(n.date) + (n.time ? ' ' + n.time : '') + ' · ' + (n.mode === 'on' ? '온라인 · ' : '') + (n.place || ''));
        var rb = nx.querySelector('.rsvp'); rb.textContent = going ? '갈게요 취소' : '갈게요'; rb.classList.toggle('ghost', !!going);
        rb.addEventListener('click', function () { self.rsvp(r, n, going); });
        var who = nx.querySelector('.who'); rs.slice(0, 8).forEach(function (x) { var im = el('span', '', faceTag(x.n, 26)); im.title = x.n; who.appendChild(im); });
        who.appendChild(el('em', '', rs.length ? rs.length + '명이 가요' : '첫 번째로 손 들어 주세요'));
        if (n.link && /^https?:\/\//.test(n.link)) { var lk = el('a', 'qk-gbtn', '신청서 열기'); lk.href = n.link; lk.target = '_blank'; lk.rel = 'noopener noreferrer'; nx.querySelector('.go').appendChild(lk); }
      } else nx.innerHTML = '<div class="tx"><p class="h">다음 모임</p><h3>다음 모임을 준비하고 있어요</h3><p class="w">날짜가 정해지면 여기에 가장 먼저 보여요</p></div>';
      if (can) {
        var ed = el('div', 'qr-edit'), btn = function (label, fn) { var x = el('button', 'qk-gbtn', label); x.type = 'button'; x.addEventListener('click', fn); ed.appendChild(x); };
        btn(n ? '다음 모임 고치기' : '다음 모임 정하기', function () { self.editNext(r); });
        if (n) btn('모임 끝 · 기록으로 옮기기', function () { self.finishMeet(r); });
        nx.appendChild(ed);
      }
      L.appendChild(nx);
      // 공지 · 모임 기록
      var notes = D.rposts.filter(function (p) { return p.region === r.id && p.kind === 'notice'; }).sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      L.appendChild(this._posts(r, '공지', notes.slice(0, 4), 'notice', can, '공지가 없어요'));
      L.appendChild(this._posts(r, '모임 기록', logs, 'log', can, '첫 모임이 끝나면 여기에 기록이 쌓여요'));
      // 자료 · 연락
      var links = D.rlinks.filter(function (x) { return x.region === r.id; }).sort(function (a, b) { return b.at - a.at; });
      var ls = el('section', 'qr-box', '<div class="hd"><h4>자료</h4></div><ul class="qr-links"></ul>'), ul = ls.querySelector('ul');
      links.forEach(function (x) {
        var u = vurl(x.u); if (!u) return;
        var li = el('li', '', '<a target="_blank" rel="noopener noreferrer"></a><small></small>'); var a = li.querySelector('a'); a.href = u; a.textContent = String(x.t || u).slice(0, 40);
        var host = ''; try { host = new URL(u).hostname.replace(/^www\./, ''); } catch (e) {} txt(li, 'small', host);
        if (can) { var del = el('button', 'x', '&times;'); del.type = 'button'; del.setAttribute('aria-label', '빼기'); del.addEventListener('click', function () { self.store.del('rlinks', x.id); }); li.appendChild(del); }
        ul.appendChild(li);
      });
      if (!links.length) ul.innerHTML = '<li class="empty">모임 자료 링크가 여기 모여요</li>';
      if (can) { var al = el('button', 'qk-gbtn', '+ 자료'); al.type = 'button'; al.addEventListener('click', function () { self.addLink(r); }); ls.querySelector('.hd').appendChild(al); }
      R.appendChild(ls);
      R.appendChild(el('section', 'qr-box qr-contact', '<div class="hd"><h4>연락</h4></div><p>모임 문의는 쿼카연구회 대표 메일로 보내 주세요. 지역 임원의 개인 연락처는 이 페이지에 올리지 않아요.</p>'));
      cols.appendChild(L); cols.appendChild(R); b.appendChild(cols);
    }
    _posts(r, title, list, kind, can, empty) {
      var self = this, s = el('section', 'qr-box qr-' + kind, '<div class="hd"><h4></h4></div><ol></ol>'), ol = s.querySelector('ol');
      txt(s, 'h4', title);
      list.forEach(function (p) {
        var li = el('li', '', '<span class="dt"></span><div><b></b><p></p></div>');
        txt(li, '.dt', kind === 'log' ? longDay(p.date).replace(/ \(.\)$/, '') : relDay(p.date, parseDay(new Date()))); txt(li, 'b', p.title); txt(li, 'p', p.body || '');
        if (can) { var del = el('button', 'x', '&times;'); del.type = 'button'; del.setAttribute('aria-label', '지우기'); del.addEventListener('click', function () { self.store.del('rposts', p.id); }); li.appendChild(del); }
        ol.appendChild(li);
      });
      if (!list.length) ol.innerHTML = '<li class="empty"></li>', txt(ol, '.empty', empty);
      if (can) { var a = el('button', 'qk-gbtn', kind === 'log' ? '+ 모임 기록' : '+ 공지'); a.type = 'button'; a.addEventListener('click', function () { self.addPost(r, kind); }); s.querySelector('.hd').appendChild(a); }
      return s;
    }
    _me() { var m = kitMe(); return m && m.name; }
    rsvp(r, n, going) {
      var self = this, done = function (name) {
        var id = r.id + '--' + n.date + '--' + vhash(name);
        if (going) self.store.del('rsvp', id); else { self.store.put('rsvp', { id: id, region: r.id, date: n.date, n: name, at: Date.now() }); toast('갈게요! ' + longDay(n.date) + '에 만나요', { mood: 'excited' }); }
      };
      var me = this._me(); if (me) return done(me);
      sheetForm(this._sheet, '갈게요', 'happy', '<p class="qo-lead">모임에서 불릴 닉네임만 적어요.</p>' + fld('닉네임', '<input name="n" maxlength="10" required placeholder="예: 바람쌤">') + '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">갈게요</button></div>',
        function (f) { var nm = f.elements.n.value.trim().slice(0, 10); if (!nm) return false; var m = kitMe() || {}; m.name = nm; store('qk-me', JSON.stringify(m)); done(nm); });
    }
    _toneAcc(r) {
      return '<fieldset class="qo-tone"><legend>색</legend>' + ['mint', 'pink', 'lavender'].map(function (t) { return '<label><input type="radio" name="c" value="' + t + '"' + ((r.tone || 'mint') === t ? ' checked' : '') + '><span class="sw tone-' + t + '"></span></label>'; }).join('') + '</fieldset>' +
        fld('우리 지역 쿼카', '<select name="a">' + RG_ACC.map(function (a) { return opt(a[0], a[1], r.acc || 'bucket'); }).join('') + '</select>');
    }
    apply(sido) {
      var self = this, me = this._me() || '';
      var f = sheetForm(this._sheet, '우리 지역에 쿼카 열기', 'excited',
        '<p class="qo-lead">지역 선생님이 직접 열어요. 신청하면 기획운영팀 요청함으로 가고, 확인되면 「활동 중」이 돼요. 회장 1 + 간사 1이면 시작할 수 있어요.</p>' +
        fld('지역', '<select name="s" required>' + opt('', '지역 고르기', sido || '') + SIDO.map(function (s) { return opt(s[0], s[1], sido || ''); }).join('') + '</select>') +
        fld('지역연구회 이름', '<input name="n" maxlength="20" required placeholder="예: 쿼카 천안·아산">') + fld('한 줄 소개', '<input name="i" maxlength="60" placeholder="어떤 선생님들이 어떻게 만나고 싶나요?">') +
        '<div class="qo-2">' + fld('회장(신청하는 분)', '<input name="p" maxlength="10" required placeholder="닉네임">') + fld('간사', '<input name="c2" maxlength="10" placeholder="닉네임 · 나중에 정해도 돼요">') + '</div>' +
        fld('함께 시작할 선생님 수', '<input type="number" name="m" min="1" max="200" value="3">') + this._toneAcc({}) +
        '<p class="qo-note">개인 휴대폰 · 메일은 적지 않아요. 기획운영팀이 연구회 메일로 연락드려요.</p><div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">신청하기</button></div>',
        function (f) {
          var s = f.elements.s.value, n = f.elements.n.value.trim(), p = f.elements.p.value.trim(); if (!s || !n || !p) { toast('지역 · 이름 · 회장을 적어 주세요', { mood: 'worried' }); return false; }
          var c = f.querySelector('[name=c]:checked'), id = uid('r');
          var reg = { id: id, sido: s, name: n.slice(0, 20), intro: f.elements.i.value.trim().slice(0, 60), tone: c ? c.value : 'mint', acc: f.elements.a.value, pres: p.slice(0, 10), vice: '', sec: f.elements.c2.value.trim().slice(0, 10), members: Math.max(1, Math.min(200, +f.elements.m.value || 1)), status: 'prep', next: null, at: Date.now() };
          self.store.put('regions', reg);
          self.store.put('reqs', { id: uid('q'), from: 'region', to: self.getAttribute('apply-to') || 'planning', kind: 'region', title: reg.name + ' 열기 신청', body: reg.intro, due: '', st: 'new', by: reg.pres, region: id, at: Date.now() });
          var m = kitMe() || {}; if (!m.name) { m.name = reg.pres; store('qk-me', JSON.stringify(m)); }
          toast('신청했어요! 기획운영팀이 확인하면 문이 열려요', { mood: 'excited', time: 3200 });
          self.dispatchEvent(new CustomEvent('apply', { detail: { id: id }, bubbles: true }));
          self.show(id);
        });
      f.elements.p.value = me;
      f.elements.s.addEventListener('change', function () { var sd = SIDO.filter(function (x) { return x[0] === f.elements.s.value; })[0]; if (sd && !f.elements.n.value) f.elements.n.placeholder = '예: 쿼카 ' + sd[1]; });
    }
    editRegion(r) {
      var self = this;
      var f = sheetForm(this._sheet, r.name + ' 고치기', 'happy',
        fld('이름', '<input name="n" maxlength="20" required>') + fld('한 줄 소개', '<input name="i" maxlength="60">') +
        '<div class="qo-3">' + fld('회장', '<input name="p" maxlength="10">') + fld('부회장', '<input name="v" maxlength="10">') + fld('간사', '<input name="c2" maxlength="10">') + '</div>' +
        fld('함께하는 선생님 수', '<input type="number" name="m" min="0" max="500">') + this._toneAcc(r) +
        '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">저장</button></div>',
        function (f) {
          var c = f.querySelector('[name=c]:checked');
          self.store.put('regions', Object.assign({}, r, { name: f.elements.n.value.trim().slice(0, 20) || r.name, intro: f.elements.i.value.trim().slice(0, 60), pres: f.elements.p.value.trim().slice(0, 10), vice: f.elements.v.value.trim().slice(0, 10), sec: f.elements.c2.value.trim().slice(0, 10), members: Math.max(0, Math.min(500, +f.elements.m.value || 0)), tone: c ? c.value : r.tone, acc: f.elements.a.value }));
          toast('지역 페이지를 고쳤어요', { mood: 'happy', time: 1600 });
        });
      f.elements.n.value = r.name || ''; f.elements.i.value = r.intro || ''; f.elements.p.value = r.pres || ''; f.elements.v.value = r.vice || ''; f.elements.c2.value = r.sec || ''; f.elements.m.value = +r.members || 0;
    }
    editNext(r) {
      var self = this, n = r.next || { date: dayAdd(14), time: '16:30', mode: 'off', place: '', topic: '', link: '' };
      var f = sheetForm(this._sheet, '다음 모임', 'excited',
        '<div class="qo-2">' + fld('날짜', '<input type="date" name="d" required>') + fld('시간', '<input type="time" name="t">') + '</div>' +
        fld('방식', '<select name="o">' + opt('off', '대면', n.mode) + opt('on', '온라인', n.mode) + '</select>') + fld('장소', '<input name="p" maxlength="40" placeholder="예: OO초 도서실 · 온라인(줌)">', '학교 이름까지 공개해도 되는지 먼저 확인해요') +
        fld('주제', '<input name="s" maxlength="40" placeholder="예: 2학기 AI 수업 나눔">') + fld('신청서 주소(있으면)', '<input name="l" maxlength="300" placeholder="https://">') +
        '<div class="qo-btns">' + (r.next ? '<button type="button" class="qk-gbtn del">모임 지우기</button>' : '') + '<span class="sp"></span><button type="submit" class="qk-cta">저장</button></div>',
        function (f) {
          var l = f.elements.l.value.trim(); if (l && !vurl(l)) { toast('신청서 주소를 다시 확인해 주세요', { mood: 'worried' }); return false; }
          self.store.put('regions', Object.assign({}, r, { next: { date: f.elements.d.value, time: f.elements.t.value, mode: f.elements.o.value, place: f.elements.p.value.trim().slice(0, 40), topic: f.elements.s.value.trim().slice(0, 40), link: l ? vurl(l) : '' } }));
          toast('다음 모임을 알렸어요', { mood: 'excited' });
        });
      f.elements.d.value = n.date; f.elements.t.value = n.time || ''; f.elements.p.value = n.place || ''; f.elements.s.value = n.topic || ''; f.elements.l.value = n.link || '';
      if (r.next) f.querySelector('.del').addEventListener('click', function () { self.store.put('regions', Object.assign({}, r, { next: null })); self._sheet.close(); });
    }
    finishMeet(r) {
      var self = this, n = r.next, d = parseDay(n.date), cnt = this._D.rsvp.filter(function (x) { return x.region === r.id && x.date === n.date; }).length;
      var f = sheetForm(this._sheet, '모임 기록 남기기', 'happy',
        fld('제목', '<input name="t" maxlength="40" required>') + fld('한 줄 기록', '<textarea name="b" rows="3" maxlength="200" placeholder="무엇을 나눴나요? 다음엔 무엇을 해 볼까요?"></textarea>') +
        '<p class="qo-note">사진을 올릴 땐 얼굴을 가린 사진만 올려요(키트의 얼굴 가리기).</p><div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">기록으로 옮기기</button></div>',
        function (f) {
          self.store.put('rposts', { id: uid('p'), region: r.id, kind: 'log', title: f.elements.t.value.trim().slice(0, 40), body: f.elements.b.value.trim().slice(0, 200), date: n.date, at: Date.now() });
          self.store.put('regions', Object.assign({}, r, { next: null }));
          toast('모임 기록에 남겼어요', { mood: 'happy' });
        });
      f.elements.t.value = (d ? (d.getMonth() + 1) + '월 모임 · ' : '') + (n.topic || ''); f.elements.b.value = cnt ? cnt + '명이 함께했어요. ' : '';
    }
    addPost(r, kind) {
      var self = this;
      sheetForm(this._sheet, kind === 'log' ? '모임 기록' : '공지', kind === 'log' ? 'happy' : 'idea',
        (kind === 'log' ? fld('모임 날짜', '<input type="date" name="d" required value="' + todayStr() + '">') : '') + fld('제목', '<input name="t" maxlength="40" required>') +
        fld(kind === 'log' ? '한 줄 기록' : '내용', '<textarea name="b" rows="4" maxlength="300"></textarea>') + '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">올리기</button></div>',
        function (f) { var t = f.elements.t.value.trim(); if (!t) return false; self.store.put('rposts', { id: uid('p'), region: r.id, kind: kind, title: t.slice(0, 40), body: f.elements.b.value.trim().slice(0, 300), date: kind === 'log' ? f.elements.d.value : todayStr(), at: Date.now() }); });
    }
    addLink(r) {
      var self = this;
      sheetForm(this._sheet, '자료 더하기', 'happy', fld('자료 이름', '<input name="t" maxlength="40" required>') + fld('주소', '<input name="u" maxlength="300" required placeholder="https://" inputmode="url">', '드라이브 · 패들렛 링크 · 학생 정보가 담긴 문서는 올리지 않아요') + '<div class="qo-btns"><span class="sp"></span><button type="submit" class="qk-cta">꽂기</button></div>',
        function (f) { var u = vurl(f.elements.u.value), t = f.elements.t.value.trim(); if (!u || !t) { toast('주소를 다시 확인해 주세요', { mood: 'worried' }); return false; } self.store.put('rlinks', { id: uid('l'), region: r.id, t: t.slice(0, 40), u: u, at: Date.now() }); });
    }
  }

  // ── 7. 카드 공방: 형식 6 · 무늬 9 · 색 4 ───────────────────────
  var CARD_FORMATS = {
    link:    { label: '링크 미리보기', note: '카톡·밴드·블로그', w: 1200, h: 630,  kind: 'wide' },
    youtube: { label: '유튜브 썸네일', note: '16:9',           w: 1280, h: 720,  kind: 'wide', big: true },
    square:  { label: '인스타 정사각', note: '1:1',            w: 1080, h: 1080, kind: 'square' },
    feed:    { label: '인스타 피드',   note: '4:5',            w: 1080, h: 1350, kind: 'feed' },
    story:   { label: '스토리·릴스',   note: '9:16',           w: 1080, h: 1920, kind: 'story' },
    poster:  { label: 'A4 포스터',     note: '인쇄용',          w: 1240, h: 1754, kind: 'poster' }
  };
  var CARD_THEMES = {
    pink:  { label: '핑크',   bg: '#FFEDF3', bg2: '#FFD9E6', deep: '#C2507A', ink: '#3B1E29', sub: '#8E5A6C', spot: '#FFFFFF', a1: '#F08DAE', a2: '#74D3BA', pat: 'rgba(214,92,135,.16)', glass: 'rgba(255,255,255,.62)', edge: 'rgba(255,255,255,.95)', pillText: '#FFFFFF' },
    mint:  { label: '민트',   bg: '#E8F8F1', bg2: '#CDF0E3', deep: '#2F8F74', ink: '#15372D', sub: '#4F7D6F', spot: '#FFFFFF', a1: '#74D3BA', a2: '#F08DAE', pat: 'rgba(47,143,116,.14)',  glass: 'rgba(255,255,255,.62)', edge: 'rgba(255,255,255,.95)', pillText: '#FFFFFF' },
    cream: { label: '크림',   bg: '#FBF4EA', bg2: '#F3E3CC', deep: '#9A5A36', ink: '#2B1D14', sub: '#7A6656', spot: '#FFFFFF', a1: '#F08DAE', a2: '#74D3BA', pat: 'rgba(154,90,54,.13)',  glass: 'rgba(255,255,255,.66)', edge: 'rgba(255,255,255,.95)', pillText: '#FFFFFF' },
    night: { label: '밤하늘', bg: '#221C33', bg2: '#30284A', deep: '#F29BBA', ink: '#FFF6EE', sub: '#CBBFDA', spot: '#3A3158', a1: '#F29BBA', a2: '#7FD6BE', pat: 'rgba(255,255,255,.07)', glass: 'rgba(255,255,255,.08)', edge: 'rgba(255,255,255,.22)', pillText: '#221C33' }
  };
  var CARD_PATTERNS = {
    plain:   '은은한 빛',
    dots:    '도트',
    gingham: '체크',
    stripes: '사선',
    grid:    '모눈종이',
    quokka:  '쿼카 무늬',
    confetti:'반짝이',
    waves:   '물결',
    glass:   '유리 방울'
  };

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function sparkle(ctx, x, y, s, color) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y - s);
    ctx.quadraticCurveTo(x + s * 0.18, y - s * 0.18, x + s, y); ctx.quadraticCurveTo(x + s * 0.18, y + s * 0.18, x, y + s);
    ctx.quadraticCurveTo(x - s * 0.18, y + s * 0.18, x - s, y); ctx.quadraticCurveTo(x - s * 0.18, y - s * 0.18, x, y - s); ctx.fill();
  }
  function heartPath(ctx, x, y, s) { // (x, y) 가운데, s = 폭
    var k = s / 44;
    ctx.beginPath(); ctx.moveTo(x, y + 20 * k);
    ctx.bezierCurveTo(x - 2.5 * k, y + 18 * k, x - 22 * k, y + 6 * k, x - 22 * k, y - 8 * k);
    ctx.bezierCurveTo(x - 22 * k, y - 15 * k, x - 16.8 * k, y - 20 * k, x - 10.2 * k, y - 20 * k);
    ctx.bezierCurveTo(x - 5.8 * k, y - 20 * k, x - 2.2 * k, y - 17.6 * k, x, y - 14 * k);
    ctx.bezierCurveTo(x + 2.2 * k, y - 17.6 * k, x + 5.8 * k, y - 20 * k, x + 10.2 * k, y - 20 * k);
    ctx.bezierCurveTo(x + 16.8 * k, y - 20 * k, x + 22 * k, y - 15 * k, x + 22 * k, y - 8 * k);
    ctx.bezierCurveTo(x + 22 * k, y + 6 * k, x + 2.5 * k, y + 18 * k, x, y + 20 * k); ctx.closePath();
  }
  function rng(seed) { var a = seedHash(seed) || 1; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function drawPattern(ctx, W, H, T, key, u, tile, rand) {
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
    var glow = function (x, y, r, c, a) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
    };
    ctx.save();
    ctx.fillStyle = T.pat; ctx.strokeStyle = T.pat;
    var i, j, x, y;
    switch (key) {
      case 'dots':
        for (y = 0, j = 0; y < H + 60 * u; y += 46 * u, j++) for (x = (j % 2) * 23 * u; x < W + 46 * u; x += 46 * u) { ctx.beginPath(); ctx.arc(x, y, 6.5 * u, 0, Math.PI * 2); ctx.fill(); }
        break;
      case 'gingham':
        for (x = 0; x < W; x += 72 * u) ctx.fillRect(x, 0, 36 * u, H);
        for (y = 0; y < H; y += 72 * u) ctx.fillRect(0, y, W, 36 * u);
        break;
      case 'stripes':
        ctx.lineWidth = 22 * u;
        for (x = -H; x < W + H; x += 64 * u) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H, H); ctx.stroke(); }
        break;
      case 'grid':
        for (x = 0, i = 0; x < W; x += 36 * u, i++) { ctx.lineWidth = (i % 5 === 0 ? 2.2 : 1) * u; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (y = 0, i = 0; y < H; y += 36 * u, i++) { ctx.lineWidth = (i % 5 === 0 ? 2.2 : 1) * u; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        break;
      case 'quokka':
        if (tile) {
          ctx.globalAlpha = T === CARD_THEMES.night ? 0.16 : 0.2;
          var s = 120 * u;
          for (y = -s / 2, j = 0; y < H; y += s * 1.15, j++) for (x = (j % 2) * s * 0.75 - s / 2, i = 0; x < W; x += s * 1.5, i++) {
            ctx.save(); ctx.translate(x + s / 2, y + s / 2); ctx.rotate(((i + j) % 2 ? 1 : -1) * 0.18); ctx.drawImage(tile, -s / 2, -s / 2, s, s); ctx.restore();
          }
          ctx.globalAlpha = 1;
        }
        break;
      case 'confetti':
        for (i = 0; i < 70; i++) {
          x = rand() * W; y = rand() * H; var c = [T.a1, T.a2, T.deep][i % 3], k = (10 + rand() * 18) * u;
          ctx.globalAlpha = 0.28 + rand() * 0.22;
          if (i % 3 === 0) sparkle(ctx, x, y, k, c);
          else if (i % 3 === 1) { ctx.fillStyle = c; heartPath(ctx, x, y, k * 1.6); ctx.fill(); }
          else { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, k * 0.42, 0, Math.PI * 2); ctx.fill(); }
        }
        ctx.globalAlpha = 1;
        break;
      case 'waves':
        ctx.lineWidth = 7 * u; ctx.lineCap = 'round';
        for (y = 30 * u, j = 0; y < H + 40 * u; y += 54 * u, j++) {
          ctx.beginPath();
          for (x = -40 * u; x <= W + 40 * u; x += 8 * u) { var yy = y + Math.sin((x / (90 * u)) * Math.PI + j * 0.9) * 9 * u; if (x < -39 * u) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); }
          ctx.stroke();
        }
        break;
      case 'glass':
        glow(W * 0.12, H * 0.18, Math.max(W, H) * 0.42, T.a1, 0.75);
        glow(W * 0.92, H * 0.3, Math.max(W, H) * 0.36, T.a2, 0.7);
        glow(W * 0.55, H * 1.02, Math.max(W, H) * 0.45, T.a1, 0.45);
        break;
      default: // plain
        glow(W * 0.05, H * 0.05, Math.max(W, H) * 0.55, T.bg2, 0.9);
        glow(W * 0.98, H * 0.98, Math.max(W, H) * 0.5, T.bg2, 0.9);
    }
    ctx.restore();
  }

  function wrapText(ctx, text, maxW, maxLines) {
    var words = String(text).split(/(\s+)/), lines = [], line = '';
    function push(l) { lines.push(l.trim()); }
    words.forEach(function (w) {
      var test = line + w;
      if (ctx.measureText(test).width <= maxW || !line.trim()) { line = test; }
      else { push(line); line = w.trimStart(); }
      while (ctx.measureText(line).width > maxW) { // 띄어쓰기 없이 긴 말은 글자 단위로 자른다
        var cut = line.length; while (cut > 1 && ctx.measureText(line.slice(0, cut)).width > maxW) cut--;
        push(line.slice(0, cut)); line = line.slice(cut);
      }
    });
    if (line.trim()) push(line);
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,2}$/, '…'); }
    return lines;
  }
  function loadImg(src) {
    var i = new Image(); i.src = src;
    return (i.decode ? i.decode() : new Promise(function (r) { i.onload = r; })).then(function () { return i; }, function () { return i; });
  }
  var fontsOnce = null;
  function fontsReady() {
    if (fontsOnce) return fontsOnce;
    if (typeof document === 'undefined' || !document.fonts || !document.fonts.load) return (fontsOnce = Promise.resolve());
    fontsOnce = Promise.all(['700 40px "Gowun Batang"', '700 20px "IBM Plex Sans KR"', '500 20px "IBM Plex Sans KR"'].map(function (f) { return document.fonts.load(f).catch(function () {}); }));
    return fontsOnce;
  }

  // 형식마다 자리 잡기. u = 크기 단위(짧은 변 720 = 1)
  function cardLayout(F, W, H, u) {
    var L = { align: 'left', titleMax: 68, titleLines: 3, subLines: 2 };
    if (F.kind === 'wide') {
      L.panel = { x: 34 * u, y: 34 * u, w: W * 0.585, h: H - 68 * u };
      var rest = W - (L.panel.x + L.panel.w);
      L.q = { cx: L.panel.x + L.panel.w + rest * 0.5, cy: H * 0.57, r: Math.min(rest * 0.37, H * 0.33) * (F.big ? 1.1 : 1) };
      L.titleMax = F.big ? 90 : 70;
    } else if (F.kind === 'square' || F.kind === 'feed') {
      L.panel = { x: 40 * u, y: 40 * u, w: W - 80 * u, h: H * (F.kind === 'feed' ? 0.5 : 0.56) };
      L.q = { cx: W * 0.6, cy: H * (F.kind === 'feed' ? 0.775 : 0.8), r: W * (F.kind === 'feed' ? 0.22 : 0.165) };
      L.titleMax = 66; L.titleLines = F.kind === 'feed' ? 4 : 3;
    } else if (F.kind === 'story') {
      L.panel = { x: 44 * u, y: 160 * u, w: W - 88 * u, h: H * 0.4 };
      L.q = { cx: W / 2, cy: H * 0.72, r: W * 0.25 };
      L.align = 'center'; L.titleMax = 70; L.titleLines = 4;
    } else { // poster
      L.panel = { x: 40 * u, y: 40 * u, w: W - 80 * u, h: H * 0.37 };
      L.q = { cx: W * 0.5, cy: H * 0.565, r: W * 0.165 };
      L.info = { y: H * 0.71 };
      L.titleMax = 76; L.titleLines = 3;
    }
    var q = L.q;
    L.friends = F.kind === 'wide'
      ? [{ x: q.cx - q.r * 1.02, y: q.cy + q.r * 0.68, s: q.r * 1.0 }, { x: q.cx + q.r * 1.06, y: q.cy + q.r * 0.7, s: q.r * 1.0 }]
      : [{ x: q.cx - q.r * 1.22, y: q.cy + q.r * 0.55, s: q.r * 0.95 }, { x: q.cx + q.r * 1.22, y: q.cy + q.r * 0.58, s: q.r * 0.95 }];
    L.bubble = { right: q.cx - q.r * 0.25, bottom: q.cy - q.r * 0.98 };
    return L;
  }

  function fitTitle(ctx, text, maxW, maxLines, maxH, big, small, fam) {
    for (var s = big; s >= small; s -= 2) {
      ctx.font = '700 ' + s + 'px ' + fam;
      var all = wrapText(ctx, text, maxW, 99);
      if (all.length <= maxLines && all.length * s * 1.22 <= maxH) return { size: s, lines: all };
    }
    ctx.font = '700 ' + small + 'px ' + fam;
    return { size: small, lines: wrapText(ctx, text, maxW, maxLines) };
  }

  /** 카드 그리기. o = { format, theme, pattern, title, subtitle, team, date, place, target, apply, bubble,
   *  expression, accessory, friends(bool), stickers(bool), panel('glass'|'paper'|'none'), highlight(bool), footer } */
  function card(canvas, o) {
    o = o || {};
    var F = CARD_FORMATS[o.format] || CARD_FORMATS.link;
    var T = CARD_THEMES[o.theme] || CARD_THEMES.cream;
    var W = F.w, H = F.h, u = Math.min(W, H) / 720;
    var sans = o.font || "'IBM Plex Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif";
    var serif = o.titleFont || "'Gowun Batang','Noto Serif KR',serif";
    var team = o.team || o.kicker || '쿼카연구회';
    var pattern = CARD_PATTERNS[o.pattern] ? o.pattern : 'plain';
    var grp = findGroup(team); // 분과·팀 이름이면 그 대표 쿼카를 기본으로
    var face = o.face || {
      expression: o.expression || (grp ? grp.face.expression : 'excited'),
      accessory: o.accessory != null ? o.accessory : (grp ? grp.face.accessory : Q.fromSeed(team).accessory)
    };
    face = Object.assign({}, face, { motion: 'none' });
    var jobs = [loadImg(Q.url(face)),
      o.friends === false ? null : loadImg(Q.url({ expression: 'happy', accessory: Q.fromSeed(team + '·1').accessory, motion: 'none' })),
      o.friends === false ? null : loadImg(Q.url({ expression: 'calm', accessory: Q.fromSeed(team + '·2').accessory, motion: 'none' })),
      pattern === 'quokka' ? loadImg(Q.url({ expression: 'smile' })) : null, fontsReady()];
    return Promise.all(jobs).then(function (im) {
      canvas.width = W; canvas.height = H;
      var ctx = canvas.getContext('2d');
      var L = cardLayout(F, W, H, u), q = L.q, P = L.panel;
      var night = T === CARD_THEMES.night;
      drawPattern(ctx, W, H, T, pattern, u, im[3], rng(F.kind + pattern + team));

      // 글 상자
      var panel = o.panel || 'glass';
      if (panel !== 'none') {
        ctx.save();
        if (!night) { ctx.shadowColor = 'rgba(70,35,20,.10)'; ctx.shadowBlur = 40 * u; ctx.shadowOffsetY = 12 * u; }
        rr(ctx, P.x, P.y, P.w, P.h, 34 * u);
        ctx.fillStyle = panel === 'paper' ? (night ? T.spot : '#FFFFFF') : T.glass; ctx.fill();
        ctx.restore();
        rr(ctx, P.x, P.y, P.w, P.h, 34 * u); ctx.lineWidth = 2 * u; ctx.strokeStyle = T.edge; ctx.stroke();
      }

      // 쿼카 무대: 해 · 점선 궤도 · 무대 원
      ctx.save();
      ctx.globalAlpha = 0.45; ctx.fillStyle = T.a2; ctx.beginPath(); ctx.arc(q.cx + q.r * 0.62, q.cy - q.r * 0.62, q.r * 0.36, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = T.bg2; ctx.beginPath(); ctx.arc(q.cx, q.cy, q.r, 0, Math.PI * 2); ctx.fill();
      ctx.setLineDash([0.1, 14 * u]); ctx.lineCap = 'round'; ctx.lineWidth = 5 * u; ctx.strokeStyle = T.a1; ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.arc(q.cx, q.cy, q.r * 1.13, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // 친구 쿼카 → 주인공 쿼카(그림 안 머리 중심이 viewBox 60·68 근처라 위로 조금 올린다)
      var put = function (img, cx, cy, size) { if (img) ctx.drawImage(img, cx - size / 2, cy - size * 0.57, size, size); };
      if (im[1]) put(im[1], L.friends[0].x, L.friends[0].y, L.friends[0].s * 1.25);
      if (im[2]) put(im[2], L.friends[1].x, L.friends[1].y, L.friends[1].s * 1.25);
      put(im[0], q.cx, q.cy, q.r * 2.3);

      // 반짝이 스티커
      if (o.stickers !== false) {
        sparkle(ctx, q.cx + q.r * 0.98, q.cy - q.r * 0.88, 26 * u, T.a1);
        sparkle(ctx, q.cx + q.r * 1.22, q.cy - q.r * 0.52, 14 * u, T.a2);
        sparkle(ctx, q.cx - q.r * 1.08, q.cy - q.r * 0.3, 12 * u, night ? '#FFFFFF' : T.deep);
        ctx.fillStyle = T.a1; heartPath(ctx, q.cx + q.r * 0.86, q.cy + q.r * 0.98, 34 * u); ctx.fill();
      }

      // 말풍선
      if (o.bubble) {
        ctx.font = '700 ' + (26 * u) + 'px ' + sans;
        var bt = wrapText(ctx, o.bubble, 360 * u, 1)[0], bw = ctx.measureText(bt).width + 40 * u, bh = 58 * u;
        var bx = Math.max(16 * u, L.bubble.right - bw), by = Math.max((F.kind === 'wide' ? 16 : P.y + P.h + 18) * u / u, L.bubble.bottom - bh);
        ctx.save();
        if (!night) { ctx.shadowColor = 'rgba(70,35,20,.12)'; ctx.shadowBlur = 18 * u; ctx.shadowOffsetY = 6 * u; }
        ctx.fillStyle = night ? T.spot : '#FFFFFF';
        rr(ctx, bx, by, bw, bh, bh / 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(bx + bw - 34 * u, by + bh - 2 * u); ctx.lineTo(bx + bw - 6 * u, by + bh + 16 * u); ctx.lineTo(bx + bw - 14 * u, by + bh - 8 * u); ctx.fill();
        ctx.restore();
        ctx.fillStyle = T.deep; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
        ctx.fillText(bt, bx + bw / 2, by + bh / 2 + 1 * u);
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      }

      // 글
      var tx = P.x + 46 * u, tw = P.w - 92 * u, center = L.align === 'center';
      var ax = center ? W / 2 : tx;
      ctx.textAlign = center ? 'center' : 'left';
      var y = P.y + 44 * u;
      // 분과 알약 + 워드마크
      ctx.font = '700 ' + (21 * u) + 'px ' + sans;
      var pw = ctx.measureText(team).width + 36 * u, ph = 44 * u;
      ctx.font = '700 ' + (16 * u) + 'px ' + sans;
      var mark = 'Q.U.O.K.A', mw = ctx.measureText(mark).width + 30 * u;
      var px = center ? W / 2 - (pw + 14 * u + mw) / 2 : tx;
      rr(ctx, px, y, pw, ph, ph / 2); ctx.fillStyle = T.deep; ctx.fill();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '700 ' + (21 * u) + 'px ' + sans; ctx.fillStyle = T.pillText; ctx.fillText(team, px + pw / 2, y + ph / 2 + 1 * u);
      ctx.textAlign = 'left'; ctx.font = '700 ' + (16 * u) + 'px ' + sans; ctx.fillStyle = T.sub;
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = (4 * u) + 'px';
      ctx.fillText(mark, px + pw + 14 * u, y + ph / 2 + 1 * u);
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
      ctx.textBaseline = 'alphabetic'; ctx.textAlign = center ? 'center' : 'left';
      y += ph + 30 * u;

      // 아래쪽(날짜·장소 알약 + 꼬리말) 자리를 먼저 잡는다
      var chips = [o.date, o.place].filter(Boolean);
      var bottomH = (chips.length && !L.info ? 44 * u + 16 * u : 0) + 26 * u;
      var subH = 0;
      ctx.font = '500 ' + (25 * u) + 'px ' + sans;
      var subLines = o.subtitle ? wrapText(ctx, o.subtitle, tw, L.subLines) : [];
      if (subLines.length) subH = 16 * u + subLines.length * 25 * u * 1.45;
      var maxTitleH = P.y + P.h - 40 * u - bottomH - subH - y - 10 * u;
      var t = fitTitle(ctx, o.title || '제목을 넣어 주세요', tw, L.titleLines, maxTitleH, L.titleMax * u, 30 * u, serif);
      ctx.font = '700 ' + t.size + 'px ' + serif;
      t.lines.forEach(function (line, i) {
        var base = y + t.size * 0.95 + i * t.size * 1.22;
        if (o.highlight !== false && i === t.lines.length - 1) {
          var lw = ctx.measureText(line).width, lx = center ? ax - lw / 2 : ax;
          ctx.save(); ctx.globalAlpha = night ? 0.32 : 0.42; ctx.fillStyle = T.a1;
          rr(ctx, lx - 6 * u, base - t.size * 0.34, lw + 12 * u, t.size * 0.42, 8 * u); ctx.fill(); ctx.restore();
        }
        ctx.fillStyle = T.ink; ctx.fillText(line, ax, base);
      });
      y += t.lines.length * t.size * 1.22;
      if (subLines.length) {
        y += 16 * u; ctx.font = '500 ' + (25 * u) + 'px ' + sans; ctx.fillStyle = T.sub;
        subLines.forEach(function (l, i) { ctx.fillText(l, ax, y + 25 * u + i * 25 * u * 1.45); });
      }

      // 날짜·장소 알약
      var by2 = P.y + P.h - 40 * u - 26 * u;
      if (chips.length && !L.info) {
        ctx.font = '600 ' + (19 * u) + 'px ' + sans;
        var cws = chips.map(function (c) { return ctx.measureText(c).width + 52 * u; }), gap = 10 * u;
        var total = cws.reduce(function (a, b) { return a + b; }, 0) + gap * (chips.length - 1);
        var cx0 = center ? W / 2 - total / 2 : tx, cy0 = by2 - 16 * u - 44 * u;
        chips.forEach(function (c, i) {
          rr(ctx, cx0, cy0, cws[i], 44 * u, 22 * u); ctx.fillStyle = night ? 'rgba(255,255,255,.1)' : '#FFFFFF'; ctx.fill();
          ctx.lineWidth = 1.5 * u; ctx.strokeStyle = night ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.06)'; ctx.stroke();
          ctx.fillStyle = i ? T.a2 : T.a1; ctx.beginPath(); ctx.arc(cx0 + 22 * u, cy0 + 22 * u, 6 * u, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = T.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(c, cx0 + 36 * u, cy0 + 23 * u);
          cx0 += cws[i] + gap;
        });
        ctx.textBaseline = 'alphabetic'; ctx.textAlign = center ? 'center' : 'left';
      }
      // 꼬리말
      ctx.font = '600 ' + (17 * u) + 'px ' + sans; ctx.fillStyle = T.sub;
      ctx.fillText(o.footer || '쿼카연구회 · AI융합교육 연구회', ax, by2 + 18 * u);

      // 포스터: 안내 줄
      if (L.info) {
        var rows = [['일시', o.date], ['장소', o.place], ['대상', o.target], ['신청', o.apply]].filter(function (r) { return r[1]; });
        var ry = L.info.y, rh = 52 * u, lx2 = P.x + 46 * u, rw = W - 2 * lx2;
        ctx.textAlign = 'left';
        rows.forEach(function (r, i) {
          ctx.strokeStyle = night ? 'rgba(255,255,255,.16)' : 'rgba(43,29,20,.14)'; ctx.lineWidth = 1.5 * u;
          ctx.beginPath(); ctx.moveTo(lx2, ry + i * rh); ctx.lineTo(lx2 + rw, ry + i * rh); ctx.stroke();
          ctx.font = '700 ' + (18 * u) + 'px ' + sans;
          var lw2 = ctx.measureText(r[0]).width + 30 * u;
          rr(ctx, lx2, ry + i * rh + 12 * u, lw2, 30 * u, 15 * u); ctx.fillStyle = T.deep; ctx.fill();
          ctx.fillStyle = T.pillText; ctx.textBaseline = 'middle'; ctx.fillText(r[0], lx2 + 15 * u, ry + i * rh + 27.5 * u);
          ctx.font = '500 ' + (23 * u) + 'px ' + sans; ctx.fillStyle = T.ink;
          ctx.fillText(wrapText(ctx, r[1], rw - lw2 - 30 * u, 1)[0], lx2 + lw2 + 22 * u, ry + i * rh + 28 * u);
          ctx.textBaseline = 'alphabetic';
        });
        if (rows.length) { ctx.beginPath(); ctx.moveTo(lx2, ry + rows.length * rh); ctx.lineTo(lx2 + rw, ry + rows.length * rh); ctx.stroke(); }
        ctx.font = '700 ' + (16 * u) + 'px ' + sans; ctx.fillStyle = T.sub;
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = (4 * u) + 'px';
        ctx.fillText('Q.U.O.K.A · 함께 연구하는 선생님들', lx2, H - 40 * u);
        if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '0px';
      }
      ctx.textAlign = 'left';
      return canvas;
    });
  }

  // 무늬 고르기 칸에 쓰는 작은 견본
  function patternSwatch(canvas, key, theme) {
    var T = CARD_THEMES[theme] || CARD_THEMES.cream;
    var tile = key === 'quokka' ? loadImg(Q.url({ expression: 'smile' })) : Promise.resolve(null);
    return tile.then(function (img) {
      var ctx = canvas.getContext('2d');
      drawPattern(ctx, canvas.width, canvas.height, T, key, canvas.height / 260, img, rng('sw' + key));
      return canvas;
    });
  }
  function cardBlob(o) {
    var c = document.createElement('canvas');
    return card(c, o).then(function () { return new Promise(function (r) { c.toBlob(r, 'image/png'); }); });
  }

  define('quoka-avatar', QuokaAvatar);
  define('quoka-state', QuokaState);
  define('quoka-checkin', QuokaCheckin);
  define('quoka-badges', QuokaBadges);
  define('quoka-roadmap', QuokaRoadmap);
  define('quoka-icon', QuokaIcon);
  define('quoka-nav', QuokaNav);
  define('quoka-guide', QuokaGuide);
  define('quoka-login', QuokaLogin);
  define('quoka-tabs', QuokaTabs);
  define('quoka-event', QuokaEvent);
  define('quoka-calendar', QuokaCalendar);
  define('quoka-stat', QuokaStat);
  define('quoka-bars', QuokaBars);
  define('quoka-sheet', QuokaSheet);
  define('quoka-post', QuokaPost);
  define('quoka-file', QuokaFile);
  define('quoka-member', QuokaMember);
  define('quoka-poll', QuokaPoll);
  define('quoka-countdown', QuokaCountdown);
  define('quoka-faq', QuokaFaq);
  define('quoka-hero', QuokaHero);
  define('quoka-banner', QuokaBanner);
  define('quoka-features', QuokaFeatures);
  define('quoka-timeline', QuokaTimeline);
  define('quoka-gallery', QuokaGallery);
  define('quoka-photo-blur', QuokaPhotoBlur);
  define('quoka-contact', QuokaContact);
  define('quoka-footer', QuokaFooter);
  define('quoka-totop', QuokaTotop);
  define('quoka-theme', QuokaTheme);
  define('quoka-pager', QuokaPager);
  define('quoka-skeleton', QuokaSkeleton);
  define('quoka-share', QuokaShare);
  define('quoka-village', QuokaVillage);
  define('quoka-ops', QuokaOps);
  define('quoka-org', QuokaOrg);
  define('quoka-regions', QuokaRegions);

  root.QuokaKit = {
    version: '2.0.0', badges: BADGES, roadmapExample: ROADMAP_EXAMPLE, states: STATES,
    groups: GROUPS, findGroup: findGroup, iconList: ICON_LIST,
    icons: Object.keys(ICONS), iconSvg: iconSvg, card: card, cardBlob: cardBlob, patternSwatch: patternSwatch,
    cardFormats: CARD_FORMATS, cardThemes: CARD_THEMES, cardPatterns: CARD_PATTERNS,
    iconMotions: ICON_MOTIONS, loginBuddy: loginBuddy, eventTypes: EV_TYPES, seasonItems: SEASON, today: null,
    toast: toast, fileTypes: FILE_T, maskPhone: maskPhone,
    blurFaces: blurFaces, setTheme: setTheme, theme: currentTheme, snsTypes: SNS,
    villageLocal: villageLocal, villageItems: VITEMS, villageArt: VART, localStore: localStore, opsSample: opsSample, sido: SIDO.map(function (s) { return { key: s[0], name: s[1] }; }), useStore: function (s) { sharedStore = s; }
  };
})(typeof window !== 'undefined' ? window : globalThis);

