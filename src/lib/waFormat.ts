// Render WhatsApp text formatting (*bold*, _italic_, ~strike~, ```mono```) as safe HTML.
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function waToHtml(text: string) {
  return escapeHtml(text)
    .replace(/```([\s\S]+?)```/g, '<code class="font-mono text-[0.92em]">$1</code>')
    .replace(/(^|[\s(])\*(?!\s)([^*\n]+?)(?<!\s)\*(?=$|[\s).,!?])/gm, '$1<strong>$2</strong>')
    .replace(/(^|[\s(])_(?!\s)([^_\n]+?)(?<!\s)_(?=$|[\s).,!?])/gm, '$1<em>$2</em>')
    .replace(/(^|[\s(])~(?!\s)([^~\n]+?)(?<!\s)~(?=$|[\s).,!?])/gm, '$1<s>$2</s>')
    .replace(/\n/g, '<br>')
}
