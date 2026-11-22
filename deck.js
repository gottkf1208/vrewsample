// 슬라이드 그리기 · 이동 · 크게 보기
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const A = 'assets/';
const slides = [];
let cur = null;
function slide(title, group, cls, build) { const s = { title, group, cls, items: [] }; cur = s; s.html = build(); slides.push(s); }
const reg = it => { cur.items.push(it); return cur.items.length - 1; };
const cr = n => `${n} 크레딧`;
function media(it) {
  const inner = it.refused ? `<div class="refused"><b>거부됨</b>${esc(it.refused)}</div>`
    : it.kind === 'vid' ? `<video data-src="${it.src}" muted loop playsinline preload="none"></video>`
    : `<img src="${it.src}" alt="${esc(it.name)}">`;
  return `<div class="media">${it.pick ? '<span class="tag">추천</span>' : ''}${it.tag ? `<span class="tag dark">${esc(it.tag)}</span>` : ''}${inner}<span class="zoom">크게 보기</span></div>`;
}
const plain = (it, cls = '', extra = '') => { const i = reg(it); return `<button class="card ${cls} ${it.pick ? 'pick' : ''}" data-i="${i}">${media(it)}${extra}</button>`; };

const prompts = [];
const pbtn = (title, text, label = '프롬프트 보기') => { prompts.push({ title, text }); return `<button class="btn ghost" data-p="${prompts.length - 1}">${label}</button>`; };
const copyBtn = (text, label = '복사') => { prompts.push({ title: '', text }); return `<button class="btn primary" data-copy="${prompts.length - 1}">${label}</button>`; };
// 내려받기: 파일 이름을 한글로 붙여 준다
const fileName = it => `브루샘플러_${String(it.dl || it.name).replace(/[\/:*?"<>|·]/g, ' ').trim().replace(/\s+/g, '-')}.${it.kind === 'vid' ? 'mp4' : 'jpg'}`;
const dlBtn = (it, label, cls = 'primary') => `<a class="btn ${cls}" href="${it.src}" download="${fileName(it)}">${label}</a>`;
const head = (part, fixed, changed, right = '') => `<div class="head"><span class="pill">${part}</span>${fixed ? `<span class="chip">고정 · ${fixed}</span>` : ''}${changed ? `<span class="chip on">바꾼 것 · ${changed}</span>` : ''}<span class="grow"></span>${right}</div>`;
const take = html => `<div class="take"><span>${html}</span></div>`;

// ───────── 브루 샘플러 본문 ─────────
const path = (...xs) => `<span class="path">${xs.map(x => `<b>${x}</b>`).join('<i>›</i>')}</span>`;
const mo = (file, cls) => `<video class="${cls}" data-src="${A}${file}" muted loop playsinline preload="none"></video>`;
const HERO_IT = { kind: 'img', src: `${A}m04-gpt26.jpg`, name: '주인공 · 어린 왕자', by: '1단계 · 주인공 캐릭터', chips: ['수채화 그림책 삽화', '세로 3:4'], note: '금빛 머리, 초록 옷, 긴 노란 목도리. 이 그림 한 장이 뒤의 모든 장면에서 주인공의 기준이 돼요.', use: '2단계에서 참고 이미지로 넣어요', prompt: P.img };
const shotItem = n => { const s = EGG_SHOTS[n]; return { kind: 'img', src: `${A}${s.img}.jpg`, name: `장면 ${n + 1} · ${s.name}`, by: '2단계 · 콘티 (주인공 그림을 참고 이미지로)', chips: ['16:9', s.t], note: s.story, use: `카메라: ${s.cam}`, prompt: s.prompt, tag: s.t }; };
const COLLAGE = () => ({ kind: 'vid', src: `${A}egg-layered.mp4`, name: '콜라주 영상 · 어린 왕자의 졸업 비행', dl: '어린왕자 졸업 콜라주 20초 자막없음', by: '3단계 · Seedance 2.5 · 콘티 4장', chips: ['20초 · 720p · 소리', '16:9'], note: '실사 배경과 종이 인형 그림이 20초 내내 따로 유지되고, 교실에서 구름 위의 별까지 한 번의 비행으로 이어져요.', prompt: P.eggVideo });
const FINAL = () => ({ kind: 'vid', src: `${A}final.mp4`, name: '완성 · 어린 왕자의 졸업 축하 영상', dl: '어린왕자 졸업 축하 영상 20초 완성본', by: '4단계 · 자막 + AI 목소리 + 배경 음악', chips: ['20초 · 720p', '자막 4줄 · 내레이션'], note: '3단계 영상 위에 자막, AI 목소리, 배경 음악을 얹은 완성본이에요.', prompt: P.script });
const ONEMIN = () => ({ kind: 'vid', src: `${A}egg-1min.mp4`, name: '1분 졸업 축하 영상 (자막 없음)', dl: '어린왕자 졸업 축하 영상 1분 자막없음', by: '그림책 20초 + 콜라주 20초 + 마무리 20초', chips: ['60초 · 720p · 소리', '자막 없음'], note: '자막을 넣지 않은 1분 영상이에요. 우리 학교 이름과 축하 문구를 브루에서 자막으로 얹어 쓰세요.' });

// ── 1 표지
slide('표지', '시작', 'cover', () => {
  const f = reg(FINAL()), a = reg(HERO_IT), b = reg(shotItem(2)), c = reg(shotItem(3));
  const th = (i, src, cap) => `<button class="card" data-i="${i}"><div class="media"><img src="${A}${src}" alt=""></div><span class="cap">${cap}</span></button>`;
  return `<div class="wrap"><div>
    <span class="pill">브루 AI 샘플러 <b>{{n}}장</b></span>
    <h1 style="margin-top:22px">그림 한 장이<br><em>졸업 영상</em>으로</h1>
    <p class="sub">브루(Vrew)의 <b>AI 이미지 · AI 비디오 · AI 목소리 · AI 음악</b>으로 어린 왕자의 졸업 축하 영상을 만드는 네 단계예요. 넣은 프롬프트와 설정을 그대로 복사해 따라 할 수 있어요.</p>
    <div class="cta"><button class="btn primary big" data-go="2">샘플러 보기</button><button class="btn ghost" style="height:44px;border-radius:12px" data-toc>목차</button><span class="chip">${CHECKED}</span></div>
  </div><div class="magic">
    <button class="screen card" data-i="${f}"><video data-src="${A}final.mp4" muted loop playsinline preload="none"></video><span class="tag dark">완성 영상 · 20초</span><span class="zoom">크게 보기</span></button>
    <div class="strip">${th(a, 'm04-gpt26.jpg', '① 주인공')}${th(b, 'cut-3.jpg', '② 콘티')}${th(c, 'cut-4.jpg', '③ 콜라주')}</div>
    <img class="quoka" src="${A}quoka-magician.png" alt="AI 영상 마술사 쿼카">${mo('mo-sparkle.webm', 'spark')}
  </div></div>`;
});

// ── 2 만드는 순서
slide('만드는 순서', '시작', '', () => {
  const st = (go, n, t, d, paths, mediaHtml) => `<button class="card" data-go="${go}"><div class="media">${mediaHtml}</div><div class="txt"><div class="n">${n}</div><h3>${t}</h3><p>${d}</p><div class="paths">${paths}</div></div></button>`;
  const im = f => `<img src="${A}${f}" alt="">`, vd = f => `<video data-src="${A}${f}" muted loop playsinline preload="none"></video>`;
  return `${head('시작하기 전에', '', '', `<span class="chip">카드를 누르면 그 단계로 가요</span>`)}<h2>네 단계로 <em>졸업 영상</em>을 만들어요</h2><div class="body">
  <div class="steps">
    ${st('1단계', '1단계', '주인공 캐릭터', '<b>어린 왕자</b> 그림 한 장을 먼저 뽑아요. 뒤의 모든 장면이 이 그림을 따라가요.', path('삽입', 'AI 이미지'), im('m04-gpt26.jpg'))}
    ${st('2단계', '2단계', '만들고 싶은 영상', '<b>졸업식 영상 20초</b>를 4장면으로 나누고, 주인공 그림을 참고로 넣어 콘티를 뽑아요.', path('삽입', 'AI 이미지') + path('참고 이미지'), im('cut-3.jpg'))}
    ${st('3단계', '3단계', '콜라주 영상', '콘티 4장을 <b>Seedance 2.5</b>에 넣어 2D 어린 왕자가 실사 화면을 나는 20초 영상으로 만들어요.', path('삽입', 'AI 비디오'), vd('egg-layered.mp4#t=6'))}
    ${st('4단계', '4단계', '자막 · 목소리 · 음악', '<b>자막, AI 목소리, 배경 음악</b>을 얹으면 졸업식에서 틀 수 있는 영상이 돼요.', path('자막') + path('AI 목소리') + path('삽입', '배경 음악'), vd('final.mp4#t=15.6'))}
  </div>
  ${take('메뉴 이름과 모델·설정은 <b>브루 공식 공지와 브루 4.9.1 화면</b>에서 확인한 것만 적었어요. 그림과 영상은 모두 누르면 크게 열리고, 넣은 프롬프트를 복사할 수 있어요.')}</div>`;
});

// ── 3 1단계
slide('1단계 · 주인공 캐릭터', '1단계 주인공', 'part', () => {
  const i = reg(HERO_IT);
  return `<img class="mini" src="${A}quoka-magician.png" alt=""><div class="wrap"><div>
    <div class="no">1단계 · AI 이미지</div><h1>주인공<br>캐릭터</h1>
    <p class="sub">만들 영상의 주인공부터 정해요. 동화책 『어린 왕자』의 한 장면을 <b>수채화 그림책 삽화</b>로 뽑았어요. 무엇을·어떻게·어디서·그림체를 적고, 끝에 비율과 넣지 말 것을 붙여요.</p>
    <div class="paths" style="margin-top:18px">${path('삽입', 'AI 이미지')}<span class="path on"><b>생성 모델</b><i>›</i><b>GPT Image 2.5 Sunburst</b></span></div>
    <div class="facts"><div class="fact"><b>기본</b><span>브루 기본 이미지 모델</span></div><div class="fact"><b>3장</b><span>참고 이미지 최대</span></div><div class="fact"><b>5</b><span>크레딧 · 1장(Low·일반)</span></div><div class="fact"><b>지원</b><span>인물·스타일 일관성</span></div></div>
    <div class="promptbox"><div class="top"><span>넣은 프롬프트</span><span class="grow"></span>${copyBtn(P.img)}</div><pre>${esc(P.img)}</pre></div>
  </div><button class="hero tall card" data-i="${i}"><img src="${A}m04-gpt26.jpg" alt=""><span class="tag dark">주인공 그림</span><span class="zoom">크게 보기</span></button></div>`;
});

// ── 4 2단계 콘티
slide('2단계 · 졸업식 영상 콘티', '2단계 콘티', '', () => {
  const cards = EGG_SHOTS.map((s, n) => plain(shotItem(n), '', `<div class="txt"><div class="row"><span class="name">${n + 1}. ${esc(s.name)}</span></div><div class="note">${esc(s.story)}</div><div class="use">카메라 · ${esc(s.cam)}</div></div>`)).join('');
  return `${head('2단계 · 만들고 싶은 영상', '', '', path('삽입', 'AI 이미지') + path('참고 이미지에 주인공 그림') + pbtn('장면 3에 넣은 프롬프트', EGG_SHOTS[2].prompt))}<h2>졸업식 영상 20초를 <em>4장면</em>으로 나눠요</h2><div class="body">
    <div class="timeline">${EGG_SHOTS.map(s => `<div><i></i><span>${s.t}</span></div>`).join('')}</div>
    <div class="grid-4">${cards}</div>
    ${take('1단계의 <b>주인공 그림을 참고 이미지로</b> 넣고 장면만 바꿔 뽑아요. 배경은 실사 사진처럼, 어린 왕자는 <b>오려 낸 종이 인형</b>으로 얹는 콜라주라서 네 장 모두 같은 주인공이에요. 장면마다 <b>카메라 움직임</b>을 미리 정해 두면 3단계 프롬프트를 쓰기 쉬워요.')}</div>`;
});

// ── 5 3단계 넣기
slide('3단계 · Seedance 2.5에 넣기', '3단계 콜라주 영상', '', () => {
  const thumbs = EGG_SHOTS.map((s, n) => { const i = reg(shotItem(n)); return `<button class="thumb card" data-i="${i}"><img src="${A}${s.img}.jpg" alt=""><span class="tag dark">${n + 1}</span></button>`; }).join('');
  const tried = reg({ kind: 'img', src: `${A}lay-3.jpg`, name: '막힌 콘티', by: '실사 화면 속에 입체적으로 그린 아이 캐릭터', chips: ['16:9'], note: '이 콘티로는 Seedance 2.5가 안전 필터로 생성을 막았어요. 주인공을 오려 낸 종이 인형으로 바꾸니 통과했어요.', tag: '막힘' });
  const passed = reg(shotItem(2));
  return `${head('3단계 · 콜라주 영상', '', '', path('삽입', 'AI 비디오') + copyBtn(P.eggVideo, '프롬프트 복사'))}<h2>콘티 4장을 <em>Seedance 2.5</em>에 한 번에 넣어요</h2><div class="body"><div class="split wide">
    <div class="side"><h3>브루에서 고를 것</h3>
      <div class="paths"><span class="path on"><b>생성 모델</b><i>›</i><b>Seedance 2.5</b></span>${path('참고 파일', '콘티 4장')}${path('20초')}${path('720p')}${path('16:9')}${path('소리 켜짐')}</div>
      <p>Seedance 2.5는 <b>참고 이미지 9장, 4~30초</b>까지 돼요. 그래서 콘티 4장과 20초를 한 번에 넣을 수 있어요.</p>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${thumbs}</div>
      <p>크레딧은 5초·720p에 <b>450</b>(할인 표시, 정가 750)이었어요. 길이를 늘리면 올라가니 <b>비디오 생성 단추 옆 숫자</b>를 꼭 확인하세요.</p>
      <h3 style="margin-top:2px">주인공은 종이 인형으로</h3>
      <div style="display:grid;grid-template-columns:1fr 24px 1fr;gap:8px;align-items:center">
        <button class="thumb card" data-i="${tried}"><img src="${A}lay-3.jpg" alt=""><span class="tag" style="background:var(--pink);color:#fff">막힘</span></button><span style="text-align:center;color:var(--brand);font-size:20px">→</span>
        <button class="thumb card" data-i="${passed}"><img src="${A}cut-3.jpg" alt=""><span class="tag">통과</span></button></div>
      <p>실사 화면 속의 <b>입체적인 아이 캐릭터</b>는 안전 필터에 걸렸어요. <b>오려 낸 종이 인형</b>으로 바꾸니 통과했어요.</p></div>
    <div class="pcard white" style="min-height:0"><div class="top"><h3>프롬프트는 네 덩어리 · 전문</h3></div>
      <div class="four"><span><b>1 역할</b> 그림 4장은 순서대로 장면 1~4의 콘티</span><span><b>2 겹</b> 배경은 실사로, 주인공은 끝까지 종이 인형으로</span><span><b>3 시간표</b> [0~5초]처럼 끊고 일어나는 일과 카메라 용어</span><span><b>4 마무리</b> 끊김 없이, 넣지 말 것, 음악과 소리</span></div>
      <pre style="-webkit-mask-image:none;mask-image:none;overflow:auto;cursor:auto;font-size:14px;line-height:22px">${esc(P.eggVideo)}</pre></div>
  </div></div>`;
});

// ── 6 3단계 결과
slide('3단계 · 완성된 콜라주 영상', '3단계 콜라주 영상', '', () => {
  const item = COLLAGE();
  const pts = EGG_NOTE.lay.points.slice(0, 4);
  return `${head('3단계 · 콜라주 영상', '', '', dlBtn(item, '영상 내려받기') + pbtn('Seedance 2.5에 넣은 프롬프트', item.prompt))}<h2>2D 어린 왕자가 <em>실사 화면</em>을 날아요 · 20초</h2><div class="body"><div class="finale">
    ${plain(item, 'big pick', `<div class="txt"><div class="row"><span class="name">${esc(item.name)}</span><span class="meta">20초 · 720p · 누르면 소리와 함께 크게</span></div></div>`)}
    <div class="side"><h3>결과에서 본 것</h3>${pts.map(p => `<p>${p}</p>`).join('')}
      <div class="quote">아직 자막도 목소리도 없어요. 다음 단계에서 브루로 얹어요.</div></div>
  </div></div>`;
});

// ── 7 4단계
slide('4단계 · 자막 · AI 목소리 · 배경 음악', '4단계 완성', '', () => {
  const rows = SCRIPT.map(s => `<tr><td class="t">${s[0]}</td><td>${esc(s[1])}</td></tr>`).join('');
  return `${head('4단계 · 얹어서 완성', '', '', path('자막') + path('AI 목소리') + path('삽입', '배경 음악'))}<h2>자막 · 목소리 · 음악을 <em>얹어요</em></h2><div class="body"><div class="split wide">
    <div class="side"><h3>브루에서 얹는 세 가지</h3><div class="stack">
      <div class="row"><div class="ic">가</div><div><h4>자막</h4><p>오른쪽 대본을 한 줄에 한 클립씩 넣어요. 영상의 장면이 5초마다 바뀌니 <b>자막도 네 줄</b>이면 돼요.</p></div></div>
      <div class="row"><div class="ic">♪</div><div><h4>AI 목소리</h4><p><b>AI 목소리</b> 메뉴에서 자막 클립에 목소리를 입혀요(AI 자막 더빙 · AI 목소리 클립 삽입). 한 줄이 5초를 넘지 않게 문장을 짧게 써요.</p></div></div>
      <div class="row"><div class="ic">♬</div><div><h4>배경 음악</h4><p><b>삽입 › 배경 음악</b>에서 고르거나 <b>AI 음악</b>으로 새로 만들어요. 목소리가 잘 들리게 음악은 작게 깔아요.</p></div></div>
    </div>
      <div class="quote">화면에 넣을 글자는 영상 모델에 맡기지 않았어요. <b>자막으로 얹는 쪽이 정확</b>하고, 학교 이름만 바꿔 다시 쓸 수 있어요.</div></div>
    <div class="pcard white" style="min-height:0"><div class="top"><h3>대본 · 자막과 목소리에 똑같이</h3>${copyBtn(P.script, '대본 복사')}<a class="btn ghost" href="${A}final-subtitle.srt" download="어린왕자-졸업영상-자막.srt">자막 파일(srt)</a></div>
      <table class="script">${rows}</table>
      <div class="ba"><button class="card" data-i="${reg(COLLAGE())}"><div class="media"><video data-src="${A}egg-layered.mp4#t=10.5" muted loop playsinline preload="none"></video></div><span class="tag dark">얹기 전 · 3단계 영상</span></button><span class="arrow">→</span><button class="card pick" data-i="${reg(FINAL())}"><div class="media"><video data-src="${A}final.mp4#t=10.5" muted loop playsinline preload="none"></video></div><span class="tag">얹은 뒤 · 완성본</span></button></div>
      <div class="where" style="margin-top:auto">말이 나오는 시간은 한 줄에 3~4초예요. 장면이 바뀌고 0.5초쯤 뒤에 말이 시작되면 자연스러워요.</div></div>
  </div></div>`;
});

// ── 8 완성
slide('완성 · 졸업 축하 영상', '4단계 완성', '', () => {
  const item = FINAL();
  return `${head('4단계 · 얹어서 완성', '', '', dlBtn(item, '완성본 내려받기') + pbtn('대본', P.script))}<h2>완성 · 어린 왕자의 <em>졸업 축하 영상</em></h2><div class="body"><div class="finale">
    <div style="position:relative">${mo('mo-done.webm', 'modone')}${plain(item, 'big pick', `<div class="txt"><div class="row"><span class="name">${esc(item.name)}</span><span class="meta">20초 · 720p · 누르면 소리와 함께 크게</span></div></div>`)}</div>
    <div class="side"><h3>얹고 나서 달라진 것</h3>
      <p><b>이야기가 생겼어요.</b> 같은 20초인데 내레이션 네 줄이 들어가자 졸업 축하 인사가 됐어요.</p>
      <p><b>자막은 말소리에 맞춰요.</b> 말이 시작되기 조금 전에 뜨고, 말이 끝난 뒤 반 박자 남겨요.</p>
      <p><b>음악은 목소리 아래로.</b> 말이 나오는 동안은 음악을 낮춰 한 글자도 묻히지 않게 했어요.</p>
      <p><b>마지막 줄이 주제예요.</b> "너의 내일이 별처럼 빛나길"이 별 장면과 만나요.</p>
      <div class="quote">우리 학교 이름과 축하 문구로 자막만 바꾸면 그대로 졸업식에서 쓸 수 있어요.</div></div>
  </div></div>`;
});

// ── 9 AI 배경 음악 꿀팁
slide('AI 배경 음악 ① 잘 뽑는 꿀팁', 'AI 배경 음악', '', () => {
  const tips = BGM_TIPS.map((t, n) => `<div class="tip"><div class="n">TIP ${n + 1}</div><h4>${t[0]}</h4><p>${t[1]}</p></div>`).join('');
  return `${head('브루 AI 음악', '', '', path('삽입', '배경 음악', 'AI 음악') + copyBtn(P.bgmGrad, '졸업 영상용 프롬프트 복사'))}<h2>AI 배경 음악, <em>이렇게 적으면</em> 잘 나와요</h2><div class="body">
    <div style="display:grid;grid-template-columns:1fr 130px;gap:16px;align-items:center">
      <div><div class="formula"><span>어디에 쓸지</span><i>+</i><span>장르</span><i>+</i><span>분위기</span><i>+</i><span>악기</span><i>+</i><span>빠르기(BPM)</span><i>+</i><span>가사 없이 / 있게</span><i>+</i><span>흐름</span></div>
      <p class="src" style="margin-top:8px">브루 4.9.0(2026. 11. 9. 공지)부터 <b>삽입 › 배경 음악 › AI 음악</b>에 원하는 분위기를 글로 적으면 배경 음악을 만들어 줘요. 가사 있는 곡과 연주곡 모두 되고, 만든 음악은 내려받을 수 있어요. · <a href="${NOTE.music}" target="_blank" rel="noopener">브루 공지 보기</a></p></div>
      ${mo('mo-music.webm', 'momusic')}</div>
    <div class="tips">${tips}</div>
    <div class="ready"><div class="bad"><div class="k">이렇게 쓰면 흔들려요</div><p>신나는 음악 만들어줘</p></div><span class="arrow">→</span>${BGM_READY.map(r => `<div class="good"><div class="k">${r[0]}</div><p>${esc(r[1])}</p>${copyBtn(r[1])}</div>`).join('')}</div>
  </div>`;
});

// ── 10 요즘 배경음악
slide('AI 배경 음악 ② 요즘 쇼츠·릴스 음악', 'AI 배경 음악', '', () => {
  const cards = BGM_TYPES.map((b, n) => { const s = BGM_SAMPLES.find(x => x.type === n);
    return `<div class="b"><h4>${n + 1}. ${b.name}</h4><div class="w">${b.where}</div><div class="f">${b.feel}</div>${b.ex ? `<div class="e">예: ${esc(b.ex)}</div>` : ''}${s ? `<audio controls preload="none" src="${A}${s.src}"></audio>` : ''}${b.p ? `<div class="pp">${esc(b.p)}</div>` + copyBtn(b.p, '프롬프트 복사') : `<div class="pp">${b.hint}</div>`}</div>`; }).join('');
  return `${head('브루 AI 음악', '', '', `<span class="chip">2026. 11. 23. 조사</span>` + pbtn('로파이 프롬프트 예시', BGM_TYPES[4].p))}<h2>요즘 쇼츠·릴스에서 <em>자주 들리는</em> 배경음악</h2><div class="body">
    <div class="bgm">${cards}</div>
    <p class="src">빠르기·악기는 그 장르의 일반적인 특징이에요. 예시 곡과 경향의 출처: <a href="https://newsroom.tiktok.com/tiktok-reveals-the-top-artists-and-songs-of-2025?lang=en" target="_blank" rel="noopener">틱톡 2025 결산</a> · <a href="https://newsroom.tiktok.com/tiktoks-global-and-us-song-of-the-summer-2026-katy-perrys-the-one-that-got-away?lang=en" target="_blank" rel="noopener">틱톡 2026 여름 결산</a> · <a href="https://buffer.com/resources/trending-songs-tiktok/" target="_blank" rel="noopener">Buffer 틱톡 인기 소리</a>. 유행 곡을 그대로 쓰면 저작권 문제가 생길 수 있어서, 같은 <b>분위기</b>를 AI 음악으로 새로 만드는 프롬프트를 붙였어요.</p>
  </div>`;
});

// ── 11 모델 검증표
slide('브루 AI 모델 한눈에', '정리', '', () => {
  const ok = '<span class="okmark">화면 확인</span>';
  const ir = V_IMG.map(m => `<tr class="${m.pick ? 'pick' : ''} ${m.off ? 'off' : ''}"><td class="nm">${m.pick ? '<span class="dot"></span>' : ''}${m.name}${m.seen ? ok : ''}</td><td class="ds">${m.about}</td><td>${m.ref}</td></tr>`).join('');
  const vr = V_VID.map(m => `<tr class="${m.pick ? 'pick' : ''}"><td class="nm">${m.pick ? '<span class="dot"></span>' : ''}${m.name}${m.seen ? ok : ''}</td><td>${m.len}</td><td>${m.res}</td><td>${m.ref}</td><td>${m.snd}</td><td class="ds">${m.mode}</td></tr>`).join('');
  return `${head('정리', '', '', `<span class="chip">${CHECKED}</span>`)}<h2>브루에서 고를 수 있는 <em>AI 모델</em></h2><div class="body"><div class="two">
    <div class="box"><h3>AI 이미지 <small>삽입 › AI 이미지 · <a href="${NOTE.image}" target="_blank" rel="noopener">공지 2026. 10. 22.</a></small></h3>
      <table class="table"><thead><tr><th>모델</th><th>잘 맞는 일</th><th>참고 이미지</th></tr></thead><tbody>${ir}</tbody></table></div>
    <div class="box"><h3>AI 비디오 <small>삽입 › AI 비디오 · <a href="${NOTE.video}" target="_blank" rel="noopener">공지 2026. 8. 25.</a></small></h3>
      <table class="table"><thead><tr><th>모델</th><th>길이</th><th>화질</th><th>참고 이미지</th><th>소리</th><th>모드</th></tr></thead><tbody>${vr}</tbody></table></div>
  </div>${take('이 샘플러는 <b>GPT Image 2.5 Sunburst</b>(그림)와 <b>Seedance 2.5</b>(영상) 기준으로 설명했어요. 옛 모델(Seedance 1 Pro Fast · 1.5 Pro, SDXL)은 제공 종료가 공지돼 표에서 뺐거나 줄을 그었어요. 모델과 크레딧은 자주 바뀌니 <b>생성 화면의 숫자</b>가 가장 정확해요.')}</div>`;
});

// ── 12 내려받기
slide('자료 내려받기', '정리', '', () => {
  const v = (it, t, d, size) => `<div class="dlcard"><button class="card" data-i="${reg(it)}">${media(it)}</button><div class="txt"><h3>${t}</h3><p>${d}</p><div class="row">${dlBtn(it, '내려받기')}<span class="meta">${size}</span></div></div></div>`;
  return `${head('정리', '', '', '<span class="chip">수업과 학교 행사용</span>')}<h2>자료 <em>내려받기</em></h2><div class="body"><div class="dlgrid">
    ${v(ONEMIN(), '1분 졸업 축하 영상', '자막 없는 1분 영상. 우리 학교 문구를 자막으로 얹어 쓰세요.', 'mp4 · 60초 · 720p · 자막 없음')}
    ${v(COLLAGE(), '콜라주 영상 20초', '종이비행기를 타고 별까지. 자막과 목소리를 얹는 연습용.', 'mp4 · 20초 · 720p · 자막 없음')}
    ${v(FINAL(), '완성본 20초', '자막 · AI 목소리 · 배경 음악까지 얹은 영상.', 'mp4 · 20초 · 720p')}
    <div class="dlcard wide"><div class="txt"><h3>따라 하기 묶음</h3><p>주인공 그림 1장, 콘티 4장, 대본, 자막 파일을 한 번에.</p><div class="row"><a class="btn primary" href="${A}vrew-sampler-pack.zip" download="브루샘플러-따라하기-묶음.zip">묶음 내려받기</a><span class="meta">zip</span></div></div></div>
    <div class="dlcard wide"><div class="txt"><h3>프롬프트 전체</h3><p>그림 · 콘티 · 영상 · 배경 음악 프롬프트를 글 파일 하나로.</p><div class="row"><button class="btn primary" data-dltxt>프롬프트 내려받기</button><span class="meta">txt</span></div></div></div>
    <div class="dlcard wide"><div class="txt"><h3>그림과 영상 하나씩</h3><p>어느 쪽에서든 그림이나 영상을 눌러 크게 연 뒤, 오른쪽의 <b>내려받기</b> 단추를 누르면 그 파일만 받을 수 있어요.</p></div></div>
  </div>${take('수업과 학교 행사에서 쓰시도록 내려받기를 열어 두었어요. 『어린 왕자』 원작은 국내에서 저작권 보호 기간이 끝난 작품이에요.')}</div>`;
});

// ── 13 곧 추가 + 확인 기록
slide('COMING SOON · 확인 기록', '정리', '', () => `${head('정리', '', '', `<span class="chip">${CHECKED}</span>`)}<h2>다음에 <em>더할 것</em>과 확인 기록</h2><div class="body"><div class="soon">
    <div class="box hold">${mo('mo-soon.webm', '')}<h3>모션 따라 하기 · 춤 따라 하기</h3><p>참고 영상의 동작을 캐릭터에게 그대로 입히는 기능이에요.<br>브루에 들어오면 이 자리에 샘플과 프롬프트를 더할게요.</p></div>
    <div class="box"><h3>이렇게 확인했어요</h3><ul>
      <li><b>모델 이름과 사양</b> 브루 공식 공지 두 건(AI 이미지 2026. 10. 22. · AI 비디오 2026. 8. 25.)과 맞춰 봤어요.</li>
      <li><b>메뉴 이름과 기본값</b> 브루 4.9.1 화면에서 삽입 › AI 이미지 · AI 비디오 · 배경 음악, AI 목소리 메뉴를 직접 열어 봤어요.</li>
      <li><b>크레딧</b> 화면에 표시된 숫자예요(이미지 1장 5, Seedance 2.5 5초·720p 450). 할인과 요금제에 따라 달라져요.</li>
      <li><b>배경 음악 경향</b> 틱톡·유튜브의 공식 결산과 안내 글을 근거로 정리했어요.</li>
      <li><b>이 자료는</b> 개인이 연수용으로 만든 것이며 브루 공식 자료가 아니에요.</li>
    </ul><div class="bye"><img src="${A}quoka-magician.png" alt=""><p>브루에 새 기능이 오면<br><b>또 뽑아서 올릴게요!</b></p></div></div>
  </div></div>`);

// 프롬프트 전체를 글 파일로
function promptsText() {
  const sec = (t, body) => `■ ${t}\n${body}\n`;
  return [
    `브루 AI 샘플러 · 프롬프트 모음 (${CHECKED})\n`,
    '【1단계 주인공 캐릭터】 삽입 › AI 이미지',
    sec('주인공 그림', P.img),
    '【2단계 졸업식 영상 콘티】 삽입 › AI 이미지 (주인공 그림을 참고 이미지로)',
    ...EGG_SHOTS.map((s, n) => sec(`장면 ${n + 1} (${s.t}) ${s.name}`, s.prompt)),
    '【3단계 콜라주 영상】 삽입 › AI 비디오 › Seedance 2.5 (콘티 4장을 참고 파일로, 20초)',
    sec('영상 프롬프트', P.eggVideo),
    '【4단계 대본】 자막과 AI 목소리에 똑같이',
    sec('대본', P.script),
    '【AI 배경 음악】 삽입 › 배경 음악 › AI 음악',
    sec('졸업 축하 영상용', P.bgmGrad),
    ...BGM_TYPES.filter(b => b.p).map(b => sec(b.name, b.p)),
  ].join('\n');
}

const stage = $('#stage');
// 그림은 그 쪽에 들어갈 때(앞뒤 한 쪽 포함) 불러온다
// 쪽 수와 쪽 범위는 슬라이드를 다 만든 뒤에 채운다 (쪽이 늘어도 번호가 맞도록)
const firstOf = k => slides.findIndex(s => s.title.startsWith(k)) + 1;
const rangeOf = g => { const ix = slides.map((s, i) => (s.group === g ? i + 1 : 0)).filter(Boolean); return `${ix[0]}–${ix[ix.length - 1]}`; };
const fill = h => h.replace(/\{\{n\}\}/g, slides.length).replace(/\{\{r:(.+?)\}\}/g, (_, g) => rangeOf(g));
stage.innerHTML = slides.map((s, n) => `<section class="slide ${s.cls}" data-n="${n + 1}">${fill(s.html).replace(/<img src="/g, '<img data-src="')}</section>`).join('') +
  `<div class="bar"></div><div class="foot"><span class="where"></span><span class="grow"></span><button class="nav" data-prev title="이전">◀</button><span class="num"></span><button class="nav" data-next title="다음">▶</button><button class="btn ghost" data-toc>목차</button><button class="btn ghost" data-full>전체 화면</button></div><div class="toast"></div>`;
const els = $$('.slide', stage);
let now = 0;

function fit() { document.documentElement.style.setProperty('--s', Math.min(innerWidth / 1600, innerHeight / 900)); }
addEventListener('resize', fit); fit();

function playVideos(root, on) {
  $$('video[data-src]', root).forEach(v => {
    if (on) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else { v.pause(); }
  });
}
function go(n, push = true) {
  n = Math.max(1, Math.min(slides.length, n));
  els.forEach((e, i) => {
    const on = i === n - 1; e.classList.toggle('active', on); playVideos(e, on);
    if (Math.abs(i - (n - 1)) <= 1) $$('img[data-src]', e).forEach(im => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
  });
  now = n;
  $('.foot .where').innerHTML = `${esc(slides[n - 1].group)} · <b>${slides[n - 1].title.replace(/<[^>]+>/g, '')}</b>`;
  $('.foot .num').textContent = `${n} / ${slides.length}`;
  $('.bar').style.width = `${n / slides.length * 100}%`;
  if (push && location.hash !== `#${n}`) history.replaceState(null, '', `#${n}`);
}

// 크게 보기
const lb = $('#lightbox');
let lbItems = [], lbAt = 0;
function showItem() {
  const it = lbItems[lbAt];
  const view = it.refused ? `<div class="refused"><b>거부됨</b>${esc(it.refused)}</div>`
    : it.kind === 'vid' ? `<video src="${it.src}" controls autoplay loop playsinline></video>` : `<img src="${it.src}" alt="">`;
  prompts.lbCopy = it.prompt || '';
  lb.innerHTML = `<div class="lb"><div class="view">${view}${lbItems.length > 1 ? `<span class="chip count">${lbAt + 1} / ${lbItems.length}</span><button class="step prev" data-step="-1">◀</button><button class="step next" data-step="1">▶</button>` : ''}</div>
    <div class="info"><button class="x" data-close title="닫기">✕</button><div class="by">${esc(it.by || '')}</div><h3>${esc(it.name)}</h3>
    <div class="chips">${it.pick ? '<span class="chip on">추천</span>' : ''}${(it.chips || []).map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>
    ${it.refused ? '' : `<div>${dlBtn(it, it.kind === 'vid' ? '영상 내려받기' : '그림 내려받기', 'ghost')}</div>`}${it.note ? `<div class="note">${esc(it.note)}</div>` : ''}${it.use ? `<div class="use">→ ${esc(it.use)}</div>` : ''}
    ${it.prompt ? `<div class="ptitle"><span>넣은 프롬프트</span><span class="grow"></span><button class="btn primary" data-copy="lb">복사</button></div><pre>${esc(it.prompt)}</pre>` : ''}</div></div>`;
}
function openItems(items, at) { lbItems = items; lbAt = at; playVideos(els[now - 1], false); lb.hidden = false; showItem(); }
function openPrompt(p) { playVideos(els[now - 1], false); prompts.lbCopy = p.text; lb.hidden = false; lbItems = [];
  lb.innerHTML = `<div class="lb only"><div class="info"><button class="x" data-close title="닫기">✕</button><h3 style="font-size:24px;line-height:32px;text-transform:none">${esc(p.title || '프롬프트')}</h3><div class="ptitle"><span>그대로 복사해서 쓰세요</span><span class="grow"></span><button class="btn primary" data-copy="lb">복사</button></div><pre>${esc(p.text)}</pre></div></div>`; }
function closeLb() { lb.hidden = true; lb.innerHTML = ''; playVideos(els[now - 1], true); }

// 목차
const toc = $('#toc');
function openToc() { toc.hidden = false; toc.innerHTML = `<div class="tocbox"><button class="x lbx" data-toc-close style="position:absolute;right:18px;top:18px;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.08)">✕</button><h3>목차</h3><div class="tocgrid">${slides.map((s, i) => `<button data-go="${i + 1}" class="${i + 1 === now ? 'now' : ''}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${s.title.replace(/<[^>]+>/g, '')}</span><span class="g">${esc(s.group)}</span></button>`).join('')}</div></div>`; }
function closeToc() { toc.hidden = true; toc.innerHTML = ''; }

function downloadText(name, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + text.replace(/\n/g, '\r\n')], { type: 'text/plain;charset=utf-8' }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('내려받았어요');
}
function toast(t) { const el = $('.toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 1400); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e2) {} ta.remove(); }
  toast('복사했어요');
}

document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-dltxt],[data-copy],[data-p],[data-i],[data-go],[data-toc],[data-toc-close],[data-prev],[data-next],[data-full],[data-close],[data-step]');
  if (!t) { if (ev.target === lb || ev.target === toc) { closeLb(); closeToc(); } return; }
  if (t.dataset.dltxt !== undefined) return downloadText('브루샘플러_프롬프트.txt', promptsText());
  if (t.dataset.copy !== undefined) return copy(t.dataset.copy === 'lb' ? prompts.lbCopy : prompts[+t.dataset.copy].text);
  if (t.dataset.p !== undefined) return openPrompt(prompts[+t.dataset.p]);
  if (t.dataset.i !== undefined) return openItems(slides[now - 1].items, +t.dataset.i);
  if (t.dataset.go !== undefined) { closeToc(); closeLb(); const g = t.dataset.go; return go(/^\d+$/.test(g) ? +g : firstOf(g)); }
  if (t.dataset.tocClose !== undefined) return closeToc();
  if (t.dataset.toc !== undefined) return openToc();
  if (t.dataset.prev !== undefined) return go(now - 1);
  if (t.dataset.next !== undefined) return go(now + 1);
  if (t.dataset.close !== undefined) return closeLb();
  if (t.dataset.step !== undefined) { lbAt = (lbAt + +t.dataset.step + lbItems.length) % lbItems.length; return showItem(); }
  if (t.dataset.full !== undefined) { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});
addEventListener('keydown', ev => {
  if (ev.target.matches && ev.target.matches('input,textarea')) return;
  const k = ev.key;
  if (!lb.hidden) {
    if (k === 'Escape') closeLb();
    else if (lbItems.length > 1 && (k === 'ArrowRight' || k === 'ArrowLeft')) { lbAt = (lbAt + (k === 'ArrowRight' ? 1 : -1) + lbItems.length) % lbItems.length; showItem(); }
    return;
  }
  if (!toc.hidden) { if (k === 'Escape') closeToc(); return; }
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { ev.preventDefault(); go(now + 1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { ev.preventDefault(); go(now - 1); }
  else if (k === 'Home') go(1); else if (k === 'End') go(slides.length);
  else if (k === 'f' || k === 'F') $('[data-full]').click();
});
addEventListener('hashchange', () => go(parseInt(location.hash.slice(1)) || 1, false));
go(parseInt(location.hash.slice(1)) || 1, false);

