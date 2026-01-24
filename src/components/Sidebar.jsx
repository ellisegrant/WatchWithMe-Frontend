function Sidebar({ isOpen, setIsOpen, onSearchClick }) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-[#0B1220] border-r border-[#1F2F44] z-50 transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#1F2F44]">
          {isOpen ? (
            <h1 className="text-xl font-bold text-white">
              <span className="text-[#1E5B99]">Jesley</span>
            </h1>
          ) : (
            <div className="w-8 h-8 bg-[#1E5B99] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">J</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button 
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-[#1E5B99] text-white hover:bg-[#2672B8] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {isOpen && <span className="font-medium">Home</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={onSearchClick}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[#A1B0C8] hover:bg-[#1A2332] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {isOpen && <span className="font-medium">Search</span>}
              </button>
            </li>
            <li>
              <button 
                onClick={() => alert('My Rooms feature coming soon! Create a room to get started.')}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-[#A1B0C8] hover:bg-[#1A2332] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {isOpen && <span className="font-medium">My Rooms</span>}
              </button>
            </li>
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-[#1F2F44]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-4 px-4 py-3 rounded-lg text-[#A1B0C8] hover:bg-[#1A2332] transition-all"
          >
            <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;