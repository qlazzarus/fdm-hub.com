export const formatDate = (iso: string, lang: 'ko'|'en'='ko') => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang==='ko'?'ko-KR':'en-US', { year:'numeric', month:'short', day:'2-digit' });
};


export const slugify = (s: string) => {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
