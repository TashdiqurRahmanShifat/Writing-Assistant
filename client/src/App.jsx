import { useState } from 'react'
import axios from 'axios'

const LANGUAGES = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C#',
  'TypeScript',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'Swift',
  'Kotlin',
  'SQL',
  'HTML',
  'CSS',
  'Other'
]

function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  const formatExplanation = (text) => {
    // First escape HTML entities
    const escaped = escapeHtml(text)
    
    // Then apply markdown-style formatting
    return escaped
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-indigo-700 font-bold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-indigo-100 text-purple-700 px-1.5 py-0.5 rounded font-mono text-sm font-semibold">$1</code>')
      .replace(/^(#{1,3})\s+(.+)$/gm, '<h3 class="text-lg font-bold text-indigo-800 mt-4 mb-2">$2</h3>')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!code.trim()) {
      setError('Please enter some code to explain')
      return
    }

    setLoading(true)
    setError('')
    setExplanation('')

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
      const response = await axios.post(`${apiUrl}/api/explain-code`, {
        code,
        language: language.toLowerCase()
      })
      
      setExplanation(response.data.explanation)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get explanation. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setCode('')
    setExplanation('')
    setError('')
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-3">
            <h1 className={`text-5xl font-bold ${darkMode ? 'text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
              Code Explanar
            </h1>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-lg`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </button>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Understand any code in seconds with AI-powered explanations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl p-8 border`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200 bg-gray-50'}`}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Paste Your Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  rows="16"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-mono text-sm resize-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>

              {error && (
                <div className={`${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 p-4 rounded`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    '✨ Explain Code'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className={`px-6 py-3 border-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'}`}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Explanation Section */}
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-xl p-8 border`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold flex items-center ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                <span className="mr-2">📖</span>
                Explanation
              </h2>
              {explanation && (
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            {!explanation && !loading && (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="text-6xl mb-4">💡</div>
                <p className="text-gray-400 text-lg">
                  Your code explanation will appear here
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-pulse space-y-4 w-full">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            )}

            {explanation && (
              <div className="max-w-none overflow-auto max-h-[600px]">
                <div className={`rounded-lg p-6 border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100'}`}>
                  <div 
                    className={`leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{
                      __html: formatExplanation(explanation)
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-12 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          <p>Powered by AI • Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default App
