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

// ───────── 브루 샘플러 본문 (문구는 copy.json → T) ─────────
const path = (...xs) => `<span class="path">${xs.map(x => `<b>${x}</b>`).join('<i>›</i>')}</span>`;
const mo = (file, cls) => `<video class="${cls}" data-src="${A}${file}" muted loop playsinline preload="none"></video>`;
// 쿼카 아이콘은 쓰지 않는다
const face = () => '';
const icon = (name, size = 40) => `<quoka-icon name="${name}" size="${size}"></quoka-icon>`;
const todo = (...keys) => `<ol class="do">${keys.map(k => `<li>${T[k]}</li>`).join('')}</ol>`;
// 브루 창을 본뜬 견본: 화면에서 확인한 칸 이름만 쓴다
const vp = (title, tabs, rows, btn, cr) => `<div class="vp"><div class="vp-top"><b>${title}</b>${tabs.map((t, i) => `<span class="${i ? '' : 'on'}">${t}</span>`).join('')}<i>브루 창 견본</i></div>
  ${rows.map(r => `<div class="vp-row"><label>${r[0]}</label><div>${r[1]}</div></div>`).join('')}
  <div class="vp-foot"><span class="vp-btn">${btn}</span><span class="vp-cr">${cr}</span></div></div>`;
const opt = (...xs) => xs.map(x => `<span class="vp-opt">${x}</span>`).join('');
const plainText = h => h.replace(/<[^>]+>/g, '');

const HERO_IT = { kind: 'img', src: `${A}vh-gpt26-sunburst.jpg`, name: '주인공 · 어린 왕자', by: '브루 AI 이미지 · GPT Image 2.6 Sunburst', chips: ['일반 · Low · 3:4', '10 크레딧', '브루에서 직접 생성'], note: plainText(T.cmp_gpt), use: '2단계에서 참고 이미지로 넣습니다', prompt: P.imgNoTitle };
const shotItem = n => { const s = EGG_SHOTS[n]; return { kind: 'img', src: `${A}${s.img}.jpg`, name: `장면 ${n + 1} · ${s.name}`, by: '브루 AI 이미지 · GPT Image 2.6 Sunburst · 캐릭터 시트를 참고 이미지로', chips: ['16:9', s.t, '10 크레딧', '브루에서 직접 생성'], note: s.story, use: `카메라: ${s.cam}`, prompt: s.prompt, tag: s.t }; };
const COLLAGE = () => ({ kind: 'vid', src: `${A}egg-layered.mp4`, name: '콜라주 영상 · 어린 왕자의 졸업 비행', dl: '어린왕자 졸업 콜라주 20초 자막없음', by: '브루 AI 비디오 · Seedance 2.5 · 콘티 4장', chips: ['20초 · 720p · 소리', '16:9', '브루에서 직접 생성'], note: plainText(T.dl_20), prompt: P.eggVideo });
const FINAL = () => ({ kind: 'vid', src: `${A}final.mp4`, name: '완성 · 어린 왕자의 졸업 축하 영상', dl: '어린왕자 졸업 축하 영상 20초 완성본', by: '4단계 · 자막 + AI 목소리 + 배경 음악', chips: ['20초 · 720p', '자막 4줄 · 내레이션'], note: plainText(T.dl_final), prompt: P.script });
const ONEMIN = () => ({ kind: 'vid', src: `${A}egg-1min.mp4`, name: '1분 졸업 축하 영상 (자막 없음)', dl: '어린왕자 졸업 축하 영상 1분 자막없음', by: '자막 없는 1분 영상', chips: ['60초 · 720p · 소리', '자막 없음'], note: plainText(T.dl_1min) });
const thumbs4 = () => EGG_SHOTS.map((s, n) => { const i = reg(shotItem(n)); return `<button class="thumb card" data-i="${i}"><img src="${A}${s.img}.jpg" alt=""><span class="tag dark">${n + 1}</span></button>`; }).join('');
const clamp = (t, n) => esc(t.length > n ? t.slice(0, n) + '…' : t);

// ── 표지: 제목은 쿼카 모션랩 「굵어지는 제목」
slide('표지', '시작', 'cover', () => {
  const f = reg(FINAL()), a = reg(HERO_IT), b = reg(shotItem(2)), c = reg(shotItem(3));
  const th = (i, src, cap) => `<button class="card" data-i="${i}"><div class="media"><img src="${A}${src}" alt=""></div><span class="cap">${cap}</span></button>`;
  return `<div class="wrap"><div class="cv-left">
    <iframe class="lab" data-src="cover.html" title="그림 한 장이 졸업 영상이 되기까지" scrolling="no" tabindex="-1"></iframe>
    <div class="cta"><button class="btn primary big" data-go="2">샘플러 보기</button><button class="btn ghost big" data-toc>목차</button><span class="chip">${CHECKED} · {{n}}쪽</span></div>
  </div><div class="cv-right">
    <button class="screen card" data-i="${f}"><video data-src="${A}final.mp4" muted loop playsinline preload="none"></video><span class="tag dark">완성 영상 · 20초</span><span class="zoom">크게 보기</span></button>
    <div class="strip">${th(a, 'vh-gpt26-sunburst.jpg', '① 주인공')}${th(b, 'cut-3.jpg', '② 콘티')}${th(c, 'cut-4.jpg', '③ 콜라주')}</div>
    
  </div></div>`;
});

// ── 만드는 순서
slide('만드는 순서', '시작', '', () => {
  const st = (go, n, ic, t, d, paths, m) => `<button class="card" data-go="${go}"><div class="media">${m}</div><div class="txt"><div class="n">${icon(ic, 34)}<span>${n}</span></div><h3>${t}</h3><p>${d}</p><div class="paths">${paths}</div></div></button>`;
  const im = f => `<img src="${A}${f}" alt="">`, vd = f => `<video data-src="${A}${f}" muted loop playsinline preload="none"></video>`;
  return `${head('시작하기 전에', '', '', `<span class="chip">카드를 누르면 그 단계로 갑니다</span>`)}<h2>네 단계로 <em>졸업 영상</em>을 만듭니다</h2><div class="body">
  <div class="steps">
    ${st('1단계', '1단계', 'camera', '주인공 캐릭터', T.flow_1, path('삽입', 'AI 이미지'), im('vh-gpt26-sunburst.jpg'))}
    ${st('2단계', '2단계', 'slides', '만들고 싶은 영상', T.flow_2, path('삽입', 'AI 이미지') + path('참고 이미지'), im('cut-3.jpg'))}
    ${st('3단계', '3단계', 'video', '콜라주 영상', T.flow_3, path('삽입', 'AI 비디오'), vd('egg-layered.mp4#t=6'))}
    ${st('4단계', '4단계', 'mic', '자막 · 목소리 · 음악', T.flow_4, path('자막') + path('AI 목소리') + path('삽입', '배경 음악'), vd('final.mp4#t=15.6'))}
  </div>${take(T.flow_take)}</div>`;
});

// ── 1단계 ① 프롬프트
slide('1단계 ① 주인공 프롬프트', '1단계 주인공', '', () => {
  const i = reg(HERO_IT);
  return `${head('1단계 · 주인공 캐릭터', '', '', path('삽입', 'AI 이미지') + copyBtn(P.imgNoTitle, '프롬프트 복사'))}<h2>주인공 <em>어린 왕자</em>부터 그립니다</h2><div class="body"><div class="tri">
    <div class="side"><h3>브루에서 이렇게</h3><p>${T.s1_sub}</p>${todo('s1_do1', 's1_do2', 's1_do3', 's1_do4')}</div>
    ${vp('AI 이미지', [], [['생성 모델', '<span class="vp-sel">GPT Image 2.6 Sunburst</span>'], ['프롬프트', `<div class="vp-ta">${clamp(P.imgNoTitle, 150)}</div>`], ['참고 이미지', '<span class="vp-empty">비워 둡니다</span>'], ['설정', opt('일반', 'Low', '3:4')]], '이미지 1장 생성', '10 크레딧 (Low · 일반)')}
    <div class="pcard white"><div class="top"><h3>프롬프트는 네 칸으로</h3></div>
      <div class="four one"><span>${T.s1_p1}</span><span>${T.s1_p2}</span><span>${T.s1_p3}</span><span>${T.s1_p4}</span></div>
      <button class="thumb card" data-i="${i}" style="margin-top:auto"><img src="${A}vh-gpt26-sunburst.jpg" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;object-position:50% 30%"><span class="tag">뽑힌 그림</span><span class="zoom">크게 보기</span></button></div>
  </div></div>`;
});

// ── 1단계 ② 같은 프롬프트, 브루 모델 9종 (두 쪽)
const heroCard = h => { const i = reg({ kind: 'img', src: `${A}vh-${h.key}.jpg`, name: `어린 왕자 · ${h.name}`, by: `브루 AI 이미지 · ${h.name}`, chips: ['일반 · Low · 3:4', `${h.cr} 크레딧`, '브루에서 직접 생성'], note: h.note, prompt: P.imgNoTitle });
  return `<button class="card hero ${h.pick ? 'pick' : ''}" data-i="${i}"><div class="media"><img src="${A}vh-${h.key}.jpg" alt="${h.name}로 뽑은 어린 왕자">${h.pick ? '<span class="tag">주인공으로 고름</span>' : ''}<span class="zoom">크게 보기</span></div><div class="txt"><div class="name">${h.name}<span class="cr">${h.cr} 크레딧</span></div><div class="note">${h.note}</div></div></button>`; };
slide('1단계 ② 같은 프롬프트, 브루 모델 9종 (가)', '1단계 주인공', '', () => `${head('1단계 · 주인공 캐릭터', '프롬프트 · 일반 · Low · 3:4', '모델', pbtn('아홉 모델에 넣은 프롬프트', P.imgNoTitle))}<h2>같은 프롬프트, <em>브루 모델 9종</em> <small>GPT Image 계열</small></h2><div class="body"><div class="heroes n5">${HEROES.slice(0, 5).map(heroCard).join('')}</div>${take(T.cmp_take)}</div>`);
slide('1단계 ② 같은 프롬프트, 브루 모델 9종 (나)', '1단계 주인공', '', () => `${head('1단계 · 주인공 캐릭터', '프롬프트 · 일반 · Low · 3:4', '모델', pbtn('아홉 모델에 넣은 프롬프트', P.imgNoTitle))}<h2>같은 프롬프트, <em>브루 모델 9종</em> <small>그 밖의 모델</small></h2><div class="body"><div class="heroes n4">${HEROES.slice(5).map(heroCard).join('')}
    <div class="side"><h3>고르는 기준</h3><p>${T.cmp_side1}</p><p>${T.cmp_side2}</p><p>${T.cmp_side3}</p></div></div>${take(T.cmp_take2)}</div>`);

// ── 1단계 ③ 캐릭터 시트
slide('1단계 ③ 캐릭터 시트', '1단계 주인공', '', () => {
  const it = { kind: 'img', src: `${A}vh-sheet.jpg`, name: '어린 왕자 캐릭터 시트', by: '브루 AI 이미지 · GPT Image 2.6 Sunburst', chips: ['참고 이미지 1장', '일반 · Low · 16:9', '10 크레딧', '브루에서 직접 생성'], note: plainText(T.sheet_take), use: '콘티를 그릴 때 참고 이미지로 넣습니다', prompt: P.sheet };
  const i = reg(it);
  return `${head('1단계 · 주인공 캐릭터', '', '', path('삽입', 'AI 이미지') + path('참고 이미지') + copyBtn(P.sheet, '프롬프트 복사'))}<h2>고른 그림으로 <em>캐릭터 시트</em>를 만듭니다</h2><div class="body"><div class="sheetrow">
    <div class="sheetl"><button class="thumb card sheetimg" data-i="${i}"><img src="${A}vh-sheet.jpg" alt="어린 왕자 캐릭터 시트: 정면, 반측면, 옆모습, 뒷모습"><span class="tag">브루에서 뽑은 캐릭터 시트</span><span class="zoom">크게 보기</span></button>
      <div class="why"><p>${T.sheet_why1}</p><p>${T.sheet_why2}</p><p>${T.sheet_why3}</p></div></div>
    ${vp('AI 이미지', [], [['생성 모델', '<span class="vp-sel">GPT Image 2.6 Sunburst</span>'], ['프롬프트', `<div class="vp-ta">${clamp(P.sheet, 190)}</div>`], ['참고 이미지', `<span class="vp-ref"><img src="${A}vh-gpt26-sunburst.jpg" alt=""></span><span class="vp-hint">고른 주인공 그림 · 최대 3장</span>`], ['설정', opt('일반', 'Low', '16:9')]], '이미지 1장 생성', '10 크레딧 (Low · 일반)')}
  </div>${take(T.sheet_take)}</div>`;
});

// ── 1단계 ③ 그림체
slide('1단계 ④ 그림체 한 줄만 바꾸면', '1단계 주인공', '', () => {
  const row = STYLES.map((s, i) => plain({ kind: 'img', src: `${A}s-gpt-${i + 1}.jpg`, name: s[0], by: '그림체 줄만 바꿈', chips: ['세로 3:4'], note: `그림체 줄: ${s[1]}`, prompt: P.style(i) })).join('');
  return `${head('1단계 · 주인공 캐릭터', '장면 · 3:4', '[그림체] 한 줄', pbtn('그림체 줄만 바꾼 프롬프트 (예: 한국 민화)', P.style(5)))}<h2>그림체 <em>한 줄</em>만 바꾸면</h2><div class="body"><div class="styles">
    <div class="labels">${STYLES.map(s => `<span>${s[0]}</span>`).join('')}</div><div class="row">${row}</div>
    <div class="stylelines">${STYLES.map(s => `<span>${esc(s[1])}</span>`).join('')}</div>
  </div>${take(T.style_take)}</div>`;
});

// ── 2단계 ① 영상 정하기
slide('2단계 ① 만들고 싶은 영상 정하기', '2단계 콘티', '', () => {
  const a = reg(HERO_IT), b = reg(shotItem(0));
  const tr = (k, v) => `<tr><td class="t">${k}</td><td>${v}</td></tr>`;
  return `${head('2단계 · 만들고 싶은 영상', '', '', `<span class="chip on">졸업식 영상 · 콜라주</span>`)}<h2>어떤 영상인지 <em>먼저 적어 둡니다</em></h2><div class="body"><div class="two">
    <div class="box"><h3>기획표</h3><table class="script plan">${tr('누구에게', T.plan_who)}${tr('길이 · 비율', T.plan_len)}${tr('분위기', T.plan_mood)}${tr('줄거리', T.plan_story)}${tr('화면 글자', T.plan_text)}</table></div>
    <div class="box"><h3>실사 위에 그림 한 겹 <small>콜라주</small></h3>
      <div class="layer3"><button class="thumb card" data-i="${a}"><img src="${A}vh-gpt26-sunburst.jpg" alt=""><span class="tag dark">주인공 그림</span></button><span class="arrow">+</span>
        <div class="bgcard"><b>실사 배경</b><span>빈 교실 · 열린 창문<br>파란 하늘 · 종이비행기</span></div><span class="arrow">=</span>
        <button class="thumb card pick" data-i="${b}"><img src="${A}cut-1.jpg" alt=""><span class="tag">얹은 한 컷</span></button></div>
      <p class="pp2">${T.plan_col1}</p><p class="pp2">${T.plan_col2}</p></div>
  </div>${take(T.plan_take)}</div>`;
});

// ── 2단계 ② 콘티 4장면 (그림을 크게, 두 줄 두 칸)
slide('2단계 ② 콘티 4장면', '2단계 콘티', '', () => {
  const cards = EGG_SHOTS.map((s, n) => plain(shotItem(n), 'cut', `<div class="txt"><span class="t">${s.t}</span><div class="name">${n + 1}. ${esc(s.name)}</div><div class="note">${esc(s.story)}</div><div class="use">카메라 · ${esc(s.cam)}</div></div>`)).join('');
  return `${head('2단계 · 만들고 싶은 영상', '캐릭터 시트 한 장', '장면', pbtn('장면 3에 넣은 프롬프트', EGG_SHOTS[2].prompt))}<h2>20초를 <em>4장면</em>으로 나눕니다</h2><div class="body">
    <div class="cuts22">${cards}</div>${take(T.board_take)}</div>`;
});

// ── 2단계 ③ 콘티 뽑는 법
slide('2단계 ③ 콘티 뽑는 법', '2단계 콘티', '', () => {
  const s = EGG_SHOTS[0];
  return `${head('2단계 · 만들고 싶은 영상', '', '', path('삽입', 'AI 이미지') + copyBtn(s.prompt, '장면 1 프롬프트 복사'))}<h2>캐릭터 시트를 <em>참고 이미지</em>로 넣습니다</h2><div class="body"><div class="tri">
    <div class="side"><h3>브루에서 이렇게</h3>${todo('bd_do1', 'bd_do2', 'bd_do3', 'bd_do4')}<div class="quote">${T.bd_note}</div></div>
    ${vp('AI 이미지', [], [['생성 모델', '<span class="vp-sel">GPT Image 2.6 Sunburst</span>'], ['프롬프트', `<div class="vp-ta">${clamp(s.prompt, 170)}</div>`], ['참고 이미지', `<span class="vp-ref wide"><img src="${A}vh-sheet.jpg" alt=""></span><span class="vp-hint">1단계 캐릭터 시트 · 최대 3장</span>`], ['설정', opt('일반', 'Low', '16:9')]], '이미지 1장 생성', '장면마다 10 크레딧, 모두 네 번')}
    <div class="pcard white"><div class="top"><h3>장면 프롬프트의 뼈대</h3></div>
      <div class="four one"><span><b>방식</b> 실사 사진 위에 종이 인형을 얹은 콜라주 한 컷</span><span><b>배경</b> 실제 사진 같은 빈 교실, 열린 창문, 햇살</span><span><b>주인공</b> 첨부한 그림의 주인공을 수채화로 그려 오려 낸 종이 인형</span><span><b>마무리</b> 가로 16:9, 넣지 말 것(글자·로고·사람)</span></div>
      <div class="thumbs4" style="margin-top:auto">${thumbs4()}</div></div>
  </div></div>`;
});

// ── 3단계 ① 브루 AI 비디오 창
slide('3단계 ① 브루의 Seedance 2.5로 만들기', '3단계 콜라주 영상', '', () => `${head('3단계 · 콜라주 영상', '', '', path('삽입', 'AI 비디오') + copyBtn(P.eggVideo, '프롬프트 복사'))}<h2>브루에 내장된 <em>Seedance 2.5</em>로 만듭니다</h2><div class="body"><div class="tri">
    <div class="side"><h3>브루에서 이렇게</h3>${todo('vid_do1', 'vid_do2', 'vid_do3', 'vid_do4')}<div class="quote">${T.vid_credit}</div></div>
    ${vp('AI 비디오', ['생성', '수정', '연장'], [['생성 모델', '<span class="vp-sel">Seedance 2.5 <em>NEW</em></span>'], ['프롬프트', `<div class="vp-ta">${clamp(P.eggVideo, 150)}</div>`], ['시작/종료 이미지', '<span class="vp-empty">비워 둡니다</span>'], ['참고 파일', `<span class="vp-refs">${EGG_SHOTS.map(s => `<img src="${A}${s.img}.jpg" alt="">`).join('')}</span>`], ['설정', opt('20초', '720p', '소리 켜짐', '16:9')]], '비디오 생성', '크레딧은 단추 옆 숫자 확인')}
    <div class="pcard white"><div class="top"><h3>Seedance 2.5 · 브루 공지 기준</h3></div>
      <table class="script plan"><tr><td class="t">길이</td><td>4~30초</td></tr><tr><td class="t">화질</td><td>720p · 1080p</td></tr><tr><td class="t">비율</td><td>16:9 · 4:3 · 1:1 · 3:4 · 9:16</td></tr><tr><td class="t">참고 이미지</td><td>9장</td></tr><tr><td class="t">소리</td><td>지원</td></tr><tr><td class="t">모드</td><td>생성 · 수정 · 연장</td></tr></table>
      <div class="where" style="margin-top:auto"><a href="${NOTE.video}" target="_blank" rel="noopener">브루 공지 「AI 비디오 생성 모델 소개」 2026. 8. 25.</a></div></div>
  </div></div>`);

// ── 3단계 ② 프롬프트
slide('3단계 ② 영상 프롬프트 네 덩어리', '3단계 콜라주 영상', '', () => {
  const tried = reg({ kind: 'img', src: `${A}lay-3.jpg`, name: '막힌 콘티', by: '실사 화면 속에 입체적으로 그린 아이 캐릭터', chips: ['16:9'], note: plainText(T.pr_doll), tag: '막힘' });
  const passed = reg(shotItem(2));
  return `${head('3단계 · 콜라주 영상', '', '', copyBtn(P.eggVideo, '프롬프트 복사'))}<h2>프롬프트는 <em>네 덩어리</em>로 씁니다</h2><div class="body"><div class="split wide">
    <div class="side"><h3>네 덩어리</h3><div class="four one"><span>${T.pr_1}</span><span>${T.pr_2}</span><span>${T.pr_3}</span><span>${T.pr_4}</span></div>
      <h3 style="margin-top:6px">주인공은 종이 인형으로</h3>
      <div style="display:grid;grid-template-columns:1fr 24px 1fr;gap:8px;align-items:center">
        <button class="thumb card" data-i="${tried}"><img src="${A}lay-3.jpg" alt=""><span class="tag" style="background:var(--pink);color:#fff">막힘</span></button><span class="arrow">→</span>
        <button class="thumb card" data-i="${passed}"><img src="${A}cut-3.jpg" alt=""><span class="tag">통과</span></button></div>
      <p>${T.pr_doll}</p></div>
    <div class="pcard white" style="min-height:0"><div class="top"><h3>넣은 프롬프트 전문</h3></div>
      <pre style="-webkit-mask-image:none;mask-image:none;overflow:auto;cursor:auto;font-size:14.5px;line-height:23px">${esc(P.eggVideo)}</pre></div>
  </div></div>`;
});

// ── 3단계 ③ 결과
slide('3단계 ③ 완성된 콜라주 영상', '3단계 콜라주 영상', '', () => {
  const item = COLLAGE();
  return `${head('3단계 · 콜라주 영상', '', '', dlBtn(item, '영상 내려받기') + pbtn('넣은 프롬프트', item.prompt))}<h2>2D 어린 왕자가 <em>실사 화면</em>을 납니다 · 20초</h2><div class="body"><div class="finale">
    ${plain(item, 'big pick', `<div class="txt"><div class="row"><span class="name">${esc(item.name)}</span><span class="meta">20초 · 720p · 누르면 소리와 함께 크게</span></div></div>`)}
    <div class="side"><h3>결과에서 본 것</h3><p>${T.res_1}</p><p>${T.res_2}</p><p>${T.res_3}</p><p>${T.res_4}</p><div class="quote">${T.res_next}</div></div>
  </div></div>`;
});


// ── 3단계 ④ 브루에서 직접 뽑은 종이비행기 (카메라 움직임 테스트)
slide('3단계 ④ 브루에서 뽑은 종이비행기', '3단계 콜라주 영상', '', () => {
  const item = { kind: 'vid', src: `${A}vrew-plane-seedance25.mp4`, name: '종이비행기 인트로 · 브루 Seedance 2.5', dl: '브루 Seedance 종이비행기 5초', by: '브루 AI 비디오 · Seedance 2.5 · 2026. 11. 23. 생성', chips: ['5초 · 720p · 소리', '16:9', '450 크레딧'], note: plainText(T.plane_1), prompt: P.plane };
  const ui = reg({ kind: 'img', src: `${A}vrew-ui-video.jpg`, name: '브루 AI 비디오 창', by: '브루 4.9.1 화면 · 2026. 11. 23.', chips: ['Seedance 2.5', '5초 · 720p · 16:9'], note: '프롬프트를 넣고 비디오 생성 단추를 누르기 직전의 화면입니다.', prompt: P.plane });
  const blk = reg({ kind: 'img', src: `${A}vrew-ui-blocked.jpg`, name: '생성이 제한되었어요', by: '브루 4.9.1 화면 · Seedance 2.0 Mini', chips: ['크레딧 차감 없음'], note: plainText(T.plane_3) });
  return `${head('3단계 · 브루에서 직접 생성', '', '', path('삽입', 'AI 비디오', 'Seedance 2.5') + dlBtn(item, '영상 내려받기') + pbtn('넣은 프롬프트', P.plane))}<h2>브루에서 뽑은 <em>종이비행기</em> · 카메라 움직임 테스트</h2><div class="body"><div class="finale">
    ${plain(item, 'big pick', `<div class="txt"><div class="row"><span class="name">${esc(item.name)}</span><span class="meta"><b>450</b> 크레딧 · 5초 · 720p · 누르면 소리와 함께 크게</span></div></div>`)}
    <div class="side"><h3>브루에서 뽑아 보니</h3><p>${T.plane_1}</p><p>${T.plane_2}</p><p>${T.plane_3}</p>
      <div class="shots2"><button class="thumb card" data-i="${ui}"><img src="${A}vrew-ui-video.jpg" alt=""><span class="tag dark">생성 직전 화면</span></button><button class="thumb card" data-i="${blk}"><img src="${A}vrew-ui-blocked.jpg" alt=""><span class="tag" style="background:var(--pink);color:#fff">Mini는 막힘</span></button></div></div>
  </div></div>`;
});

// ── 4단계 세 쪽: 자막 · AI 목소리 · 배경 음악
const SAY = ['3.0초', '3.5초', '3.4초', '4.0초'];
const scriptTable = withSay => `<table class="script">${SCRIPT.map((s, n) => `<tr><td class="t">${s[0]}</td><td>${esc(s[1])}</td>${withSay ? `<td class="s">말 ${SAY[n]}</td>` : ''}</tr>`).join('')}</table>`;
const how = (title, h2, paths, keys, noteKey, right) => slide(title, '4단계 완성', '', () => `${head('4단계 · 얹어서 완성', '', '', paths)}<h2>${h2}</h2><div class="body"><div class="split wide">
    <div class="side"><h3>브루에서 이렇게</h3>${todo(...keys)}<div class="quote">${T[noteKey]}</div></div>${right()}</div></div>`);
how('4단계 ① 자막', '<em>자막</em>을 네 줄로 넣습니다', path('홈', '클립 나누기') + path('서식'), ['sub_do1', 'sub_do2', 'sub_do3', 'sub_do4'], 'sub_note',
  () => `<div class="pcard white" style="min-height:0"><div class="top"><h3>대본 · 한 줄이 한 장면</h3>${copyBtn(P.script, '대본 복사')}<a class="btn ghost" href="${A}final-subtitle.srt" download="어린왕자-졸업영상-자막.srt">자막 파일(srt)</a></div>${scriptTable(false)}
    <div class="capdemo"><img src="${A}final-poster.jpg" alt=""><span class="tag dark">자막을 얹은 화면</span></div></div>`);
how('4단계 ② AI 목소리', '자막에 <em>AI 목소리</em>를 입힙니다', path('AI 목소리', 'AI 자막 더빙'), ['voice_do1', 'voice_do2', 'voice_do3', 'voice_do4'], 'voice_note',
  () => `<div class="pcard white" style="min-height:0"><div class="top"><h3>한 줄은 3~4초 분량으로</h3>${copyBtn(P.script, '대본 복사')}</div>${scriptTable(true)}
    <div class="quote">장면이 바뀌고 0.5초쯤 뒤에<br>말이 시작되면 자연스럽습니다.</div></div>`);
how('4단계 ③ 배경 음악', '<em>배경 음악</em>을 깔고 음량을 맞춥니다', path('삽입', '배경 음악', 'AI 음악'), ['bgm_do1', 'bgm_do2', 'bgm_do3', 'bgm_do4'], 'bgm_note',
  () => `<div class="pcard white" style="min-height:0"><div class="top"><h3>졸업 축하 영상용 프롬프트</h3>${copyBtn(P.bgmGrad)}</div><pre class="plainpre">${esc(P.bgmGrad)}</pre><div class="made"><span class="okmark">이 프롬프트로 브루 AI 음악이 만든 곡</span><audio controls preload="none" src="${A}bgm-graduation.mp3"></audio></div>
    <div class="ba"><button class="card" data-i="${reg(COLLAGE())}"><div class="media"><video data-src="${A}egg-layered.mp4#t=10.5" muted loop playsinline preload="none"></video></div><span class="tag dark">얹기 전 · 3단계 영상</span></button><span class="arrow">→</span><button class="card pick" data-i="${reg(FINAL())}"><div class="media"><video data-src="${A}final.mp4#t=10.5" muted loop playsinline preload="none"></video></div><span class="tag">얹은 뒤 · 완성본</span></button></div></div>`);

// ── 완성
slide('완성 · 졸업 축하 영상', '4단계 완성', '', () => {
  const item = FINAL();
  return `${head('4단계 · 얹어서 완성', '', '', dlBtn(item, '완성본 내려받기') + pbtn('대본', P.script))}<h2>완성 · 어린 왕자의 <em>졸업 축하 영상</em></h2><div class="body"><div class="finale">
    <div style="position:relative">${mo('mo-done.webm', 'modone')}${plain(item, 'big pick', `<div class="txt"><div class="row"><span class="name">${esc(item.name)}</span><span class="meta">20초 · 720p · 누르면 소리와 함께 크게</span></div></div>`)}</div>
    <div class="side"><h3>얹고 나서 달라진 것</h3><p>${T.fin_1}</p><p>${T.fin_2}</p><p>${T.fin_3}</p><p>${T.fin_4}</p><div class="quote">${T.fin_quote}</div></div>
  </div></div>`;
});

// ── AI 배경 음악 두 쪽
slide('AI 배경 음악 ① 잘 뽑는 요령', 'AI 배경 음악', '', () => {
  const tips = BGM_TIPS.map((t, n) => `<div class="tip"><div class="n">TIP ${n + 1}</div><h4>${t}</h4><p>${T['tip_' + (n + 1)]}</p></div>`).join('');
  return `${head('브루 AI 음악', '', '', path('삽입', '배경 음악', 'AI 음악') + copyBtn(P.bgmGrad, '졸업 영상용 프롬프트 복사'))}<h2>AI 배경 음악, <em>이렇게 적으면</em> 잘 나옵니다</h2><div class="body">
    <div style="display:grid;grid-template-columns:1fr 150px;gap:16px;align-items:center">
      <div><div class="formula"><span>어디에 쓸지</span><i>+</i><span>장르</span><i>+</i><span>분위기</span><i>+</i><span>악기</span><i>+</i><span>빠르기(BPM)</span><i>+</i><span>가사 없이 / 있게</span><i>+</i><span>흐름</span></div>
      <div class="paths" style="margin-top:8px"><span class="chip on">생성 모델 Lyria 3 Pro</span><span class="chip">최대 3분</span><span class="chip">한 곡 150 크레딧</span><span class="chip">프롬프트 2,000자까지</span></div>
      <p class="src" style="margin-top:8px">${T.bgm_lead} · <a href="${NOTE.music}" target="_blank" rel="noopener">브루 공지 보기</a></p></div><button class="thumb card uishot" data-i="${reg({ kind: 'img', src: `${A}vrew-ui-music.jpg`, name: '브루 AI 음악 창', by: '브루 4.9.1 화면 · 2026. 11. 23.', chips: ['Lyria 3 Pro', '한 곡 150 크레딧'], note: '졸업 축하 프롬프트를 넣고 생성 단추를 누르기 직전의 화면입니다.' })}"><img src="${A}vrew-ui-music.jpg" alt="브루 AI 음악 창"><span class="tag dark">실제 화면</span></button></div>
    <div class="tips">${tips}</div>
    <div class="ready"><div class="bad"><div class="k">이렇게 쓰면 흔들립니다</div><p>신나는 음악 만들어줘</p></div><span class="arrow">→</span>${BGM_READY.map(r => `<div class="good"><div class="k">${r[0]}<span class="okmark">브루 AI 음악 · ${r[3]}</span></div><p>${esc(r[1])}</p><audio controls preload="none" src="${A}${r[2]}"></audio><div class="row2">${copyBtn(r[1], '프롬프트 복사')}<a class="btn ghost" href="${A}${r[2]}" download="브루AI음악_${r[0].replace(/[ ·]+/g, '-')}.mp3">내려받기</a></div></div>`).join('')}</div>
  </div>`;
});
slide('AI 배경 음악 ② 요즘 쇼츠·릴스 음악', 'AI 배경 음악', '', () => {
  const cards = BGM_TYPES.map((b, n) => { const s = BGM_SAMPLES.find(x => x.type === n);
    return `<div class="b"><h4>${n + 1}. ${b.name}</h4><div class="w">${b.where}</div><div class="f">${b.feel}</div>${b.ex ? `<div class="e">예: ${esc(b.ex)}</div>` : ''}${s ? `<div class="au"><span class="okmark">브루 AI 음악 · ${s.len}</span><audio controls preload="none" src="${A}${s.src}"></audio></div>` : ''}${b.p ? `<div class="pp">${esc(b.p)}</div><div class="row2">${copyBtn(b.p, '프롬프트 복사')}${s ? `<a class="btn ghost" href="${A}${s.src}" download="브루AI음악_${b.name.replace(/[ ·]+/g, '-')}.mp3">내려받기</a>` : ''}</div>` : `<div class="pp">${b.hint}</div>`}</div>`; }).join('');
  return `${head('브루 AI 음악', '', '', `<span class="chip">2026. 11. 23. 조사</span>`)}<h2>요즘 쇼츠·릴스에서 <em>자주 들리는</em> 배경음악 <small>유형마다 브루 AI 음악으로 뽑은 곡을 바로 들어 보세요</small></h2><div class="body">
    <div class="bgm">${cards}</div>
    <p class="src">${T.types_src} 출처: <a href="https://newsroom.tiktok.com/tiktok-reveals-the-top-artists-and-songs-of-2025?lang=en" target="_blank" rel="noopener">틱톡 2025 결산</a> · <a href="https://newsroom.tiktok.com/tiktoks-global-and-us-song-of-the-summer-2026-katy-perrys-the-one-that-got-away?lang=en" target="_blank" rel="noopener">틱톡 2026 여름 결산</a> · <a href="https://buffer.com/resources/trending-songs-tiktok/" target="_blank" rel="noopener">Buffer 틱톡 인기 소리</a></p>
  </div>`;
});

// ── 모델 표
slide('브루 AI 모델 한눈에', '정리', '', () => {
  const ok = '<span class="okmark">화면 확인</span>';
  const ir = V_IMG.map(m => `<tr class="${m.pick ? 'pick' : ''} ${m.off ? 'off' : ''}"><td class="nm">${m.pick ? '<span class="dot"></span>' : ''}${m.name}${m.seen ? ok : ''}</td><td class="ds">${m.about}</td><td>${m.ref}</td></tr>`).join('');
  const vr = V_VID.map(m => `<tr class="${m.pick ? 'pick' : ''}"><td class="nm">${m.pick ? '<span class="dot"></span>' : ''}${m.name}${m.seen ? ok : ''}</td><td>${m.len}</td><td>${m.res}</td><td>${m.ref}</td><td>${m.snd}</td><td class="ds">${m.mode}</td></tr>`).join('');
  return `${head('정리', '', '', `<span class="chip">${CHECKED}</span>`)}<h2>브루에서 고를 수 있는 <em>AI 모델</em></h2><div class="body"><div class="two">
    <div class="box"><h3>AI 이미지 <small>삽입 › AI 이미지 · <a href="${NOTE.image}" target="_blank" rel="noopener">공지 2026. 10. 22.</a> · 화면 2026. 11. 23.</small></h3>
      <table class="table"><thead><tr><th>모델</th><th>잘 맞는 일</th><th>크레딧 (일반 · Low · 3:4)</th></tr></thead><tbody>${ir}</tbody></table></div>
    <div class="box"><h3>AI 비디오 <small>삽입 › AI 비디오 · <a href="${NOTE.video}" target="_blank" rel="noopener">공지 2026. 8. 25.</a></small></h3>
      <table class="table"><thead><tr><th>모델</th><th>길이</th><th>화질</th><th>참고 이미지</th><th>소리</th><th>모드</th></tr></thead><tbody>${vr}</tbody></table></div>
  </div>${take(T.model_take)}</div>`;
});

// ── 내려받기
slide('자료 내려받기', '정리', '', () => {
  const v = (it, t, d, size) => `<div class="dlcard"><button class="card" data-i="${reg(it)}">${media(it)}</button><div class="txt"><h3>${t}</h3><p>${d}</p><div class="row">${dlBtn(it, '내려받기')}<span class="meta">${size}</span></div></div></div>`;
  return `${head('정리', '', '', '<span class="chip">수업과 학교 행사용</span>')}<h2>자료 <em>내려받기</em></h2><div class="body"><div class="dlgrid">
    ${v(ONEMIN(), '1분 졸업 축하 영상', T.dl_1min, 'mp4 · 60초 · 720p · 자막 없음')}
    ${v(COLLAGE(), '콜라주 영상 20초', T.dl_20, 'mp4 · 20초 · 720p · 자막 없음')}
    ${v(FINAL(), '완성본 20초', T.dl_final, 'mp4 · 20초 · 720p')}
    <div class="dlcard wide"><div class="txt"><h3>${icon('download', 30)} 따라 하기 묶음</h3><p>주인공 그림, 캐릭터 시트, 콘티 4장, 대본, 자막 파일</p><div class="row"><a class="btn primary" href="${A}vrew-sampler-pack.zip" download="브루샘플러-따라하기-묶음.zip">묶음 내려받기</a><span class="meta">zip</span></div></div></div>
    <div class="dlcard wide"><div class="txt"><h3>${icon('worksheet', 30)} 프롬프트 전체</h3><p>그림 · 콘티 · 영상 · 배경 음악 프롬프트를 글 파일 하나로</p><div class="row"><button class="btn primary" data-dltxt>프롬프트 내려받기</button><span class="meta">txt</span></div></div></div>
    <div class="dlcard wide"><div class="txt"><h3>${icon('download', 30)} 브루 AI 음악 9곡</h3><p>브루 AI 음악으로 만든 연주곡. 눌러서 받습니다.</p><div class="row" style="flex-wrap:wrap;gap:6px">${BGM_SAMPLES.map(x => `<a class="btn ghost sm" href="${A}${x.src}" download="브루AI음악_${BGM_TYPES[x.type].name.replace(/[ ·]+/g, '-')}.mp3">${BGM_TYPES[x.type].name}</a>`).join('')}</div></div></div>
  </div>${take(T.dl_take)}</div>`;
});

// ── 확인 기록
slide('확인 기록', '정리', '', () => `${head('정리', '', '', `<span class="chip">${CHECKED}</span>`)}<h2>이렇게 <em>확인했습니다</em></h2><div class="body"><div class="soon one">
    <div class="box"><ul><li>${T.rec_1}</li><li>${T.rec_2}</li><li>${T.rec_3}</li><li>${T.rec_4}</li><li>${T.rec_6}</li><li>${T.rec_5}</li></ul></div>
  </div></div>`);

// ── 마지막 장: COMING SOON (표지와 같은 어두운 전체 화면, 쿼카 모션랩 「글자 사이로 통과」)
slide('COMING SOON', '정리', 'cover soonc', () => `<iframe class="lab" data-src="soon.html" data-replay title="COMING SOON 모션 따라 하기 · 춤 따라 하기" scrolling="no" tabindex="-1"></iframe>
  <div class="soon-foot"><span class="chip on">브루 업데이트를 기다리는 중</span><p>${T.soon_body}</p><button class="btn ghost big" data-go="1">처음으로</button></div>`);

// 프롬프트 전체를 글 파일로
function promptsText() {
  const sec = (t, body) => `■ ${t}\n${body}\n`;
  return [
    `브루 AI 샘플러 · 프롬프트 모음 (${CHECKED})\n`,
    '【1단계 주인공 캐릭터】 삽입 › AI 이미지',
    sec('주인공 그림', P.imgNoTitle), sec('그림체만 바꾸기 (예: 한국 민화)', P.style(5)),
    '【2단계 졸업식 영상 콘티】 삽입 › AI 이미지 (주인공 그림을 참고 이미지로)',
    ...EGG_SHOTS.map((s, n) => sec(`장면 ${n + 1} (${s.t}) ${s.name}`, s.prompt)),
    '【3단계 콜라주 영상】 삽입 › AI 비디오 › Seedance 2.5 (콘티 4장을 참고 파일로, 20초)',
    sec('영상 프롬프트', P.eggVideo),
    '【4단계 대본】 자막과 AI 목소리에 똑같이', sec('대본', P.script),
    '【AI 배경 음악】 삽입 › 배경 음악 › AI 음악', sec('졸업 축하 영상용', P.bgmGrad),
    ...BGM_READY.slice(1).map(r => sec(r[0], r[1])), ...BGM_TYPES.filter(b => b.p).map(b => sec(b.name, b.p)),
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


// 표지의 모션랩 장면(iframe): 보일 때 불러오고, 그 안의 키·마우스를 덱으로 넘긴다
function playVideos(root, on) {
  $$('video[data-src]', root).forEach(v => { if (on) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); });
  $$('iframe[data-src]', root).forEach(f => { if (on && (!f.getAttribute('src') || f.dataset.replay !== undefined)) { f.addEventListener('load', () => hookFrame(f), { once: true }); f.src = f.dataset.src; } });
}
function hookFrame(f) {
  try {
    const w = f.contentWindow, d = f.contentDocument;
    const keys = ['ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', ' ', 'Home', 'End', 'f', 'F'];
    w.addEventListener('keydown', e => { if (keys.includes(e.key)) { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: e.key })); } });
    const pt = e => { const r = f.getBoundingClientRect(), k = r.width / f.clientWidth; return [r.left + e.clientX * k, r.top + e.clientY * k]; };
    d.addEventListener('pointerdown', e => { const p = pt(e); window.__fx && window.__fx.burst(p[0], p[1]); });
    d.addEventListener('pointermove', e => { const p = pt(e); window.__fx && window.__fx.trail(p[0], p[1]); });
  } catch (e) {}
}
