export const SUPPORTED_LANGS = ['ko','en'] as const;
export type Lang = typeof SUPPORTED_LANGS[number];
export const DEFAULT_LANG: Lang = 'ko';

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (SUPPORTED_LANGS as readonly string[]).includes(v);
}

// /en/foo/bar → 'en' | /ko/... → 'ko' | else default
export function getLangFromUrl(pathname: string): Lang {
  const seg = pathname.split('/').filter(Boolean)[0];
  return isLang(seg) ? seg : DEFAULT_LANG;
}

// replace first segment with lang (or insert if missing)
export function withLang(pathname: string, lang: Lang): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return `/${lang}/`;
  if (isLang(parts[0] as any)) parts[0] = lang;
  else parts.unshift(lang);
  const trailing = pathname.endsWith('/') ? '/' : '';
  return '/' + parts.join('/') + trailing;
}

// --- Dictionary & t() ---
type Dict = Record<string, { ko: string; en: string }>;
const dict: Dict = {
  // list page
  'list.description': {
    ko: '3D 프린트 뉴스 & 링크 큐레이션',
    en: '3D Print News & Link Curation'
  },
  'list.heading': {
    ko: '최근 글',
    en: 'Recent Posts'
  },  
  // 404
  '404.title': { ko: '페이지를 찾을 수 없어요', en: 'Page not found' },
  '404.desc':  { ko: '주소가 바뀌었거나 글이 삭제되었을 수 있습니다.', en: 'The address may have changed or the post was removed.' },
  '404.home.ko': { ko: '한국어 홈', en: 'Korean Home' },
  '404.home.en': { ko: 'English Home', en: 'English Home' },
  // Header / global
  'global.brand': { ko: 'FDM Hub', en: 'FDM Hub' },
  'global.selectLanguage': { ko: '언어 선택', en: 'Select language' },
  'global.theme.dark': { ko: 'Dark', en: 'Dark' },
  'global.theme.light': { ko: 'Light', en: 'Light' },
  'pagination.prev': { ko: '이전', en: 'Prev' },
	'pagination.next': { ko: '다음', en: 'Next' },
  // Index
  'index.redirecting': { ko: '언어에 맞춰 이동 중…', en: 'Redirecting to your language…' },
  'tag.label': { ko: '태그', en: 'Tag' },
  'tag.descriptionPrefix': { ko: '다음 태그의 글:', en: 'Posts tagged' },
  'tag.latestUpdate': { ko: '최근 업데이트:', en: 'Latest update:' },
  'tag.noPosts': { ko: '글이 아직 없습니다', en: 'No posts yet' },
  // About page
  'about.title': {
    ko: 'FDM Hub 소개',
    en: 'About FDM Hub'
  },
  'about.desc': {
    ko: 'FDM Hub는 3D 프린팅 업계의 최신 뉴스, 혁신적인 트렌드, 그리고 오늘의 무료 STL을 선별해 소개하는 큐레이션 플랫폼입니다. 우리는 단순한 정보 제공을 넘어, 메이커 생태계의 성장을 돕는 신뢰할 수 있는 허브를 목표로 합니다.',
    en: 'FDM Hub is a curation platform that delivers the latest 3D-printing news, innovation trends, and a daily free STL pick. Beyond information, our goal is to become a trusted hub that supports the growth of the maker ecosystem.'
  },
  'about.intro': {
    ko: '3D 프린팅은 더 이상 전문가의 전유물이 아닙니다. 누구나 아이디어를 실물로 구현할 수 있는 시대, 우리는 정보를 연결하여 더 많은 메이커가 창의적인 여정을 지속할 수 있도록 돕습니다. FDM Hub는 신뢰할 수 있는 소스에서 수집한 뉴스를 선별하고, 바로 출력 가능한 무료 STL을 매일 소개하며, 메이커 커뮤니티와 산업 간의 간극을 줄이는 다리가 되고자 합니다.',
    en: '3D printing is no longer limited to professionals. In an era where anyone can turn an idea into a tangible creation, we help makers continue their creative journey through accessible, reliable information. FDM Hub curates verified industry news, highlights a new free STL every day, and bridges the gap between the maker community and the 3D-printing industry.'
  },
  'about.what': { ko: '우리가 전하는 콘텐츠', en: 'What We Publish' },
  'about.what.news': {
    ko: '매일 업데이트되는 3D 프린팅 업계 뉴스와 주요 트렌드 — 소재, 장비, 오픈소스, 디자인, 스타트업까지 모두 다룹니다.',
    en: 'Daily updates on 3D-printing industry news and key trends — from materials and machines to open source, design, and emerging startups.'
  },
  'about.what.freeStl': {
    ko: '“오늘의 무료 STL” 코너에서는 검증된 오픈소스 디자인이나 커뮤니티 인기 모델을 선별하여 공유합니다. 직접 출력 테스트를 거친 추천도 포함됩니다.',
    en: 'Our “Free STL of the Day” feature highlights verified open-source designs and trending community models, including curated picks that we’ve tested ourselves.'
  },
  'about.what.tips': {
    ko: '프린팅 세팅, 슬라이서 최적화, 소재 선택, 후처리 노하우 등 실질적인 제작 팁을 제공합니다.',
    en: 'We offer practical insights: slicer optimization, print settings, material choices, and post-processing techniques.'
  },
  'about.mission': { ko: '미션 & 비전', en: 'Mission & Vision' },
  'about.mission.body': {
    ko: 'FDM Hub의 미션은 “정보의 효율화를 통해 창작의 진입장벽을 낮추는 것”입니다. 우리는 3D 프린팅 생태계의 투명성과 접근성을 높여, 더 많은 사람이 아이디어를 현실로 구현하도록 돕습니다. 우리의 비전은 단순한 뉴스 플랫폼을 넘어, 전 세계 메이커들이 연결되고 협력하는 “지식 네트워크 허브”가 되는 것입니다.',
    en: 'Our mission is to lower the barriers to creation through information efficiency. We aim to make the 3D-printing ecosystem more transparent and accessible, empowering more people to bring ideas to life. Our vision extends beyond being a news platform — we strive to become a “knowledge network hub” where makers worldwide connect and collaborate.'
  },
  'about.sustain': { ko: '운영과 수익', en: 'How We Sustain' },
  'about.sustain.body': {
    ko: 'FDM Hub는 광고, 제휴(어필리에이트) 링크, 그리고 커뮤니티 후원을 통해 운영됩니다. 모든 링크는 명확히 표시되며, 신뢰할 수 있는 파트너만을 소개합니다. 사용자는 추가 비용 없이 구매를 통해 플랫폼의 지속적인 운영을 지원할 수 있습니다. 또한, 향후에는 프리미엄 콘텐츠와 브랜드 협업을 통해 더 풍부한 메이커 경험을 제공할 계획입니다.',
    en: 'FDM Hub is sustained through ads, affiliate links, and community support. All partnerships are transparently disclosed, and we only feature trusted partners. Users can support the platform at no extra cost through purchases via our links. In the future, we plan to expand into premium content and brand collaborations to deliver a richer maker experience.'
  },
  'about.contact': { ko: '문의', en: 'Contact' },
  'about.contact.prefix': {
    ko: '제휴, 뉴스 제보, 또는 협업 제안은 아래 이메일로 연락해 주세요:',
    en: 'For partnerships, press tips, or collaboration proposals, please reach out at:'
  },
  // Printers (KR list)
  'printers.kr.title': { ko: '국내 구매 가능 3D 프린터', en: '3D Printers in Korea' },
  'printers.kr.desc': { ko: '한국에서 구매 가능한 FDM 프린터를 검색/필터링하세요.', en: 'Filter and search FDM printers available in Korea.' },
  'printers.kr.searchPlaceholder': { ko: '브랜드/모델 검색…', en: 'Search brand/model…' },
  'printers.kr.allBrands': { ko: '전체 브랜드', en: 'All brands' },
  'printers.kr.allMotions': { ko: '전체 모션', en: 'All motions' },
  'printers.kr.openEnclosed': { ko: '오픈/밀폐', en: 'Open/Enclosed' },
  'printers.kr.enclosed': { ko: '밀폐형', en: 'Enclosed' },
  'printers.kr.open': { ko: '오픈형', en: 'Open' },
  'printers.kr.anySpeed': { ko: '속도 전체', en: 'Any speed' },
  'printers.kr.anyVolume': { ko: '볼륨 전체', en: 'Any volume' },
  'printers.kr.anyPrice': { ko: '가격 전체', en: 'Any price' },
  'printers.kr.hintKROnly': { ko: '기본 필터: 한국 구매 가능 제품만 표시.', en: 'Default filter: Korea availability only.' },
  'printers.kr.disclaimer': { ko: '일부 링크는 어필리에이트일 수 있습니다.', en: 'Affiliate links may earn a commission.' },
  'printers.kr.th.brand': { ko: '브랜드', en: 'Brand' },
  'printers.kr.th.model': { ko: '모델', en: 'Model' },
  'printers.kr.th.motion': { ko: '모션', en: 'Motion' },
  'printers.kr.th.build': { ko: '빌드(mm)', en: 'Build (mm)' },
  'printers.kr.th.speedTyp': { ko: '속도(권장)', en: 'Speed (typ.)' },
  'printers.kr.th.priceKRW': { ko: '가격(원)', en: 'Price (KRW)' },
  'printers.kr.th.homepage': { ko: '홈페이지', en: 'Homepage' },
  'printers.kr.th.stores': { ko: '구매', en: 'Stores' },  
  'printers.kr.lastUpdatedPrefix': { ko: '최종 업데이트', en: 'Last updated' },
  'printers.kr.th.image': { ko: '이미지', en: 'Image' },
  'printers.kr.official': { ko: '공식', en: 'Official' },  
  'printers.kr.th.info': { ko: '정보', en: 'Info' },
  'printers.kr.details': { ko: '상세', en: 'Details' },
  'printers.kr.tags': { ko: '태그', en: 'Tags' },
  'printers.kr.features': { ko: '특징', en: 'Features' },
  'printers.kr.pros': { ko: '장점', en: 'Pros' },
  'printers.kr.cons': { ko: '단점', en: 'Cons' },
  'printers.kr.close': { ko: '닫기', en: 'Close' },
  // … 필요한 문구를 여기에 계속 추가
};

export function t(key: keyof typeof dict, lang: Lang): string {
  const item = dict[key];
  if (!item) return key;
  return item[lang] ?? item[DEFAULT_LANG];
}

// 간단한 헬퍼: 번역 두 문자열 중 선택
export function pickByLang<T>(ko: T, en: T, lang: Lang): T {
  return lang === 'en' ? en : ko;
}