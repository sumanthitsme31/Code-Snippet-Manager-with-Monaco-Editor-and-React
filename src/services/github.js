const GISTS_API = 'https://api.github.com/gists'
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''

function headers() {
  const h = { 'Content-Type': 'application/json', Accept: 'application/vnd.github+json' }
  if (TOKEN) h['Authorization'] = `Bearer ${TOKEN}`
  return h
}

function extractGistId(url) {
  // handles https://gist.github.com/user/GIST_ID or just GIST_ID
  const match = url.match(/([a-f0-9]{20,})/i)
  return match ? match[1] : null
}

function detectLanguage(filename = '') {
  const ext = filename.split('.').pop().toLowerCase()
  const map = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', rb: 'ruby', go: 'go', rs: 'rust', cpp: 'cpp', c: 'c',
    cs: 'csharp', java: 'java', php: 'php', swift: 'swift', kt: 'kotlin',
    html: 'html', css: 'css', scss: 'scss', json: 'json', yaml: 'yaml',
    yml: 'yaml', sh: 'shell', bash: 'shell', md: 'markdown', sql: 'sql',
    xml: 'xml', r: 'r', lua: 'lua',
  }
  return map[ext] || 'plaintext'
}

function langToExt(lang = 'javascript') {
  const map = {
    javascript: 'js', typescript: 'ts', python: 'py', ruby: 'rb', go: 'go',
    rust: 'rs', cpp: 'cpp', c: 'c', csharp: 'cs', java: 'java', php: 'php',
    swift: 'swift', kotlin: 'kt', html: 'html', css: 'css', scss: 'scss',
    json: 'json', yaml: 'yml', shell: 'sh', markdown: 'md', sql: 'sql',
    xml: 'xml', plaintext: 'txt',
  }
  return map[lang.toLowerCase()] || 'txt'
}

export async function importGist(url) {
  try {
    const id = extractGistId(url)
    if (!id) throw new Error('Invalid Gist URL')

    const res = await fetch(`${GISTS_API}/${id}`, { headers: headers() })
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)

    const data = await res.json()
    const files = Object.values(data.files)
    if (!files.length) throw new Error('Gist has no files')

    const file = files[0]
    return {
      title: data.description || file.filename || 'Imported Gist',
      content: file.content || '',
      language: detectLanguage(file.filename),
      tags: ['gist', 'imported'],
    }
  } catch (err) {
    throw new Error(err.message || 'Failed to import gist')
  }
}

export async function exportGist(snippet) {
  const ext = langToExt(snippet.language)
  const filename = `${snippet.title.replace(/[^a-z0-9_-]/gi, '_')}.${ext}`

  const payload = {
    description: snippet.title,
    public: true,
    files: {
      [filename]: { content: snippet.content || ' ' },
    },
  }

  const res = await fetch(GISTS_API, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }

  const data = await res.json()
  return data.html_url
}
