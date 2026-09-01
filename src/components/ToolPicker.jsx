import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { preferenceKeys } from '../privacy/preferences'
import { fuzzyFilter } from '../utils/fuzzy'
import './ToolPicker.css'

const MAX_RECENT = 5

function getRecentIds() {
  try {
    const recentIds = JSON.parse(localStorage.getItem(preferenceKeys.recentTools))
    return Array.isArray(recentIds) ? recentIds.filter(id => typeof id === 'string') : []
  } catch {
    return []
  }
}

function saveRecentId(id) {
  const recentIds = getRecentIds().filter(recentId => recentId !== id)
  recentIds.unshift(id)
  localStorage.setItem(preferenceKeys.recentTools, JSON.stringify(recentIds.slice(0, MAX_RECENT)))
}

const categoryTabs = [
  { id: 'text', name: 'Text' },
  { id: 'encode', name: 'Encode' },
  { id: 'data', name: 'Data' },
  { id: 'number', name: 'Number' },
  { id: 'hash', name: 'Hash' },
  { id: 'color', name: 'Color' },
  { id: 'units', name: 'Units' },
  { id: 'image', name: 'Image' },
  { id: 'media', name: 'Media' },
  { id: 'document', name: 'Document' },
  { id: 'utility', name: 'Utility' },
]

const TAB_FORMAT_GROUPS = {
  text: ['Case', 'Markup'],
  encode: ['Text'],
  data: ['Data', 'Time'],
  number: ['Number'],
  hash: ['Hash'],
  color: ['Color'],
  units: [
    'Length', 'Weight', 'Speed', 'Area', 'Volume', 'Duration',
    'Energy', 'Pressure', 'Angle', 'Frequency', 'Power', 'Temperature',
    'Distance', 'Cooking', 'Force', 'Illuminance', 'Fuel Economy',
    'Data Rate', 'Data Size', 'Torque', 'Acceleration', 'Capacitance',
    'Electric', 'Resistance', 'Voltage', 'Density', 'Typography',
  ],
  image: [],
  media: [],
  document: [],
  utility: [],
}

const TAB_TOOL_CATEGORIES = {
  text: ['text'],
  encode: ['encode'],
  data: ['data'],
  number: ['number'],
  hash: ['hash'],
  color: ['color'],
  units: [],
  image: ['image'],
  media: ['media'],
  document: ['document'],
  utility: ['utility', 'web'],
}

// Reverse lookup: format group → tab id
const groupToTab = {}
for (const [tab, groups] of Object.entries(TAB_FORMAT_GROUPS)) {
  for (const g of groups) groupToTab[g] = tab
}

// Reverse lookup: tool category → tab id
const toolCatToTab = {}
for (const [tab, cats] of Object.entries(TAB_TOOL_CATEGORIES)) {
  for (const c of cats) toolCatToTab[c] = tab
}

const allToolCategories = Object.values(TAB_TOOL_CATEGORIES).flat()

function getTabForFormat(formatId, releasedFormats) {
  const f = releasedFormats.find(format => format.id === formatId)
  if (!f) return 'text'
  return groupToTab[f.group] || 'text'
}

function getTabForConverter(converter) {
  return toolCatToTab[converter.category] || 'utility'
}

function getInitialTab(mode, currentFormatValue, currentConverterValue, releasedFormats, releasedTools) {
  if (mode === 'to') return 'text'
  if (currentConverterValue) {
    const conv = releasedTools.find(tool => tool.id === currentConverterValue)
    if (conv) return getTabForConverter(conv)
  }
  if (currentFormatValue) return getTabForFormat(currentFormatValue, releasedFormats)
  return 'text'
}

function clampHighlightedIndex(index, length) {
  if (index < 0) return index
  if (length === 0) return -1
  return index >= length ? length - 1 : index
}

function ExperimentalBadge({ tool }) {
  if (tool.tier !== 'experimental') return null
  return <span className="tool-picker-tool-tier" aria-label={tool.tierLabel}>{tool.tierLabel}</span>
}

function ToolPickerContent({
  open,
  onClose,
  onSelectFormat,
  onSelectConverter,
  mode, // 'from' | 'to'
  align = 'left',
  availableFormatIds,
  currentFormatValue,
  currentConverterValue,
  releasedFormats = [],
  releasedTools = [],
  categories = [],
}) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState(() => getInitialTab(mode, currentFormatValue, currentConverterValue, releasedFormats, releasedTools))
  const [highlighted, setHighlighted] = useState(-1)
  const searchRef = useRef(null)
  const listRef = useRef(null)
  const overlayRef = useRef(null)
  const tabsRef = useRef(null)

  // On open, focus search and align scroll positions
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
    requestAnimationFrame(() => {
      searchRef.current?.focus()
      // Scroll the active tab button into view on mobile
      if (tabsRef.current) {
        const activeBtn = tabsRef.current.querySelector('.tool-picker-tab.active')
        activeBtn?.scrollIntoView?.({ block: 'nearest', inline: 'center' })
      }
    })
  }, [])

  // Reset list scroll when switching tabs
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0
  }, [activeTab])

  // All formats available (respecting availableFormatIds filter)
  const allAvailableFormats = useMemo(() => {
    if (!open) return []
    return availableFormatIds
      ? releasedFormats.filter(format => availableFormatIds.includes(format.id))
      : releasedFormats
  }, [open, availableFormatIds, releasedFormats])

  // Tab-scoped format list (grouped)
  const { tabGrouped, tabFlatFormats, tabFormatIndexMap } = useMemo(() => {
    if (!open || mode === 'to') return { tabGrouped: {}, tabFlatFormats: [], tabFormatIndexMap: new Map() }

    const tabGroups = TAB_FORMAT_GROUPS[activeTab] || []
    if (tabGroups.length === 0) return { tabGrouped: {}, tabFlatFormats: [], tabFormatIndexMap: new Map() }
    const tabGroupSet = new Set(tabGroups)
    const tabFormats = allAvailableFormats.filter(f => tabGroupSet.has(f.group))

    const groups = {}
    for (const f of tabFormats) {
      if (!groups[f.group]) groups[f.group] = []
      groups[f.group].push(f)
    }

    const flat = Object.values(groups).flat()
    const indexMap = new Map(flat.map((f, i) => [f, i]))
    return { tabGrouped: groups, tabFlatFormats: flat, tabFormatIndexMap: indexMap }
  }, [open, mode, activeTab, allAvailableFormats])

  // Tab-scoped tool list
  const tabTools = useMemo(() => {
    if (!open || mode === 'to') return []
    const cats = TAB_TOOL_CATEGORIES[activeTab] || []
    if (cats.length === 0) return []
    return releasedTools.filter(tool => cats.includes(tool.category))
  }, [open, mode, activeTab, releasedTools])

  // "to" mode format list
  const toAvailableFormats = useMemo(() => {
    if (!open || mode !== 'to') return []
    return availableFormatIds
      ? releasedFormats.filter(format => availableFormatIds.includes(format.id))
      : releasedFormats
  }, [open, mode, availableFormatIds, releasedFormats])

  const { toGrouped, toFlatFormats, toFormatIndexMap } = useMemo(() => {
    if (!open || mode !== 'to') return { toGrouped: {}, toFlatFormats: [], toFormatIndexMap: new Map() }

    const q = query.trim()
    const filtered = q
      ? fuzzyFilter(q, toAvailableFormats, f => [f.name, f.id, f.group])
      : toAvailableFormats

    const recent = getRecentIds().filter(id => filtered.some(f => f.id === id))
    const recentFormats = recent.map(id => filtered.find(f => f.id === id)).filter(Boolean)
    const recentIds = new Set(recent)

    const groups = {}
    for (const f of filtered) {
      if (recentIds.has(f.id)) continue
      if (!groups[f.group]) groups[f.group] = []
      groups[f.group].push(f)
    }

    const allGroups = recentFormats.length ? { Recent: recentFormats, ...groups } : groups
    const flat = Object.values(allGroups).flat()
    const indexMap = new Map(flat.map((f, i) => [f, i]))
    return { toGrouped: allGroups, toFlatFormats: flat, toFormatIndexMap: indexMap }
  }, [open, mode, toAvailableFormats, query])

  // Search mode: all formats + all tools (global across tabs)
  const { searchFormats, searchTools } = useMemo(() => {
    if (!open || mode === 'to') return { searchFormats: [], searchTools: [] }
    const q = query.trim()
    if (!q) return { searchFormats: [], searchTools: [] }

    const filteredFormats = fuzzyFilter(q, allAvailableFormats, f => [f.name, f.id, f.group])
    const searchableTools = releasedTools.filter(tool => allToolCategories.includes(tool.category))
    const filteredTools = fuzzyFilter(q, searchableTools, tool => [tool.name, tool.description, tool.id, tool.categoryName || '', tool.category || ''])
    return { searchFormats: filteredFormats, searchTools: filteredTools }
  }, [open, mode, query, allAvailableFormats, releasedTools])

  const isSearchMode = query.trim().length > 0

  // Build flat navigation list
  const flatItems = useMemo(() => {
    if (!open) return []
    if (mode === 'to') return toFlatFormats.map(f => ({ type: 'format', item: f }))
    if (isSearchMode) {
      const formatItems = searchFormats.map(f => ({ type: 'format', item: f }))
      const toolItems = searchTools.map(c => ({ type: 'converter', item: c }))
      return [...formatItems, ...toolItems]
    }
    const formatItems = tabFlatFormats.map(f => ({ type: 'format', item: f }))
    const toolItems = tabTools.map(c => ({ type: 'converter', item: c }))
    return [...formatItems, ...toolItems]
  }, [open, mode, isSearchMode, toFlatFormats, searchFormats, searchTools, tabFlatFormats, tabTools])

  const clampedHighlighted = clampHighlightedIndex(highlighted, flatItems.length)

  // Pre-compute index maps for search mode
  const { searchFormatIndexMap, searchToolIndexMap } = useMemo(() => {
    if (!isSearchMode || mode === 'to') return { searchFormatIndexMap: new Map(), searchToolIndexMap: new Map() }
    const fMap = new Map()
    const tMap = new Map()
    for (let i = 0; i < flatItems.length; i++) {
      const fi = flatItems[i]
      if (fi.type === 'format') fMap.set(fi.item, i)
      else tMap.set(fi.item, i)
    }
    return { searchFormatIndexMap: fMap, searchToolIndexMap: tMap }
  }, [flatItems, isSearchMode, mode])

  // Index map for tab tools (offset by format count)
  const tabToolIndexMap = useMemo(() => {
    if (isSearchMode || mode === 'to') return new Map()
    const offset = tabFlatFormats.length
    return new Map(tabTools.map((c, i) => [c, offset + i]))
  }, [isSearchMode, mode, tabFlatFormats.length, tabTools])

  // Scroll highlighted item into view
  useEffect(() => {
    if (clampedHighlighted < 0 || !listRef.current) return
    const items = listRef.current.querySelectorAll('[data-picker-item]')
    if (items[clampedHighlighted]) {
      items[clampedHighlighted].scrollIntoView?.({ block: 'nearest' })
    }
  }, [clampedHighlighted])

  const handleSelectFormat = useCallback((id) => {
    saveRecentId(id)
    onSelectFormat(id)
    onClose()
  }, [onSelectFormat, onClose])

  const handleSelectConverter = useCallback((converter) => {
    saveRecentId(converter.id)
    onSelectConverter(converter)
    onClose()
  }, [onSelectConverter, onClose])

  const handleSelect = useCallback((idx) => {
    const entry = flatItems[idx]
    if (!entry) return
    if (entry.type === 'format') handleSelectFormat(entry.item.id)
    else handleSelectConverter(entry.item)
  }, [flatItems, handleSelectFormat, handleSelectConverter])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => {
        if (flatItems.length === 0) return -1
        const clamped = clampHighlightedIndex(h, flatItems.length)
        return Math.min(clamped + 1, flatItems.length - 1)
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => {
        if (flatItems.length === 0) return -1
        const clamped = clampHighlightedIndex(h, flatItems.length)
        return Math.max(clamped - 1, 0)
      })
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (clampedHighlighted >= 0 && flatItems[clampedHighlighted]) {
        e.preventDefault()
        handleSelect(clampedHighlighted)
      } else if (flatItems.length === 1) {
        e.preventDefault()
        handleSelect(0)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  if (!open) return null

  const isToMode = mode === 'to'
  const hasTabFormats = tabFlatFormats.length > 0
  const hasTabTools = tabTools.length > 0
  const categoryNames = new Map(categories.map(category => [category.id, category.name]))

  return (
    <div className={`tool-picker${align === 'right' ? ' align-right' : ''}`} ref={overlayRef}>
      <div className="tool-picker-search">
        <svg className="tool-picker-search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlighted(e.target.value.trim() ? 0 : -1)
          }}
          onKeyDown={handleKeyDown}
          placeholder={isToMode ? 'Search formats...' : 'Search all conversions...'}
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {!isToMode && !isSearchMode && (
        <div className="tool-picker-tabs" ref={tabsRef}>
          {categoryTabs.map(tab => (
            <button
              key={tab.id}
              className={`tool-picker-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setHighlighted(-1) }}
            >
              {categoryNames.get(tab.id) || tab.name}
            </button>
          ))}
        </div>
      )}

      <div className="tool-picker-list" ref={listRef}>
        {/* Search mode: show mixed results */}
        {isSearchMode && !isToMode && (
          <>
            {searchFormats.length > 0 && (
              <div className="tool-picker-section">
                <div className="tool-picker-section-label">Formats</div>
                {searchFormats.map(f => {
                  const globalIdx = searchFormatIndexMap.get(f) ?? -1
                  return (
                    <div
                      key={`f-${f.id}`}
                      data-picker-item
                      className={`tool-picker-format-item${f.id === currentFormatValue ? ' selected' : ''}${globalIdx === clampedHighlighted ? ' highlighted' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectFormat(f.id) }}
                      onMouseEnter={() => setHighlighted(globalIdx)}
                    >
                      <span className="tool-picker-format-name">{f.name}</span>
                      <span className="tool-picker-format-group">{f.group}</span>
                    </div>
                  )
                })}
              </div>
            )}
            {searchTools.length > 0 && (
              <div className="tool-picker-section">
                <div className="tool-picker-section-label">Tools</div>
                {searchTools.map(c => {
                  const globalIdx = searchToolIndexMap.get(c) ?? -1
                  return (
                    <div
                      key={`c-${c.id}`}
                      data-picker-item
                      className={`tool-picker-tool-item${c.id === currentConverterValue ? ' selected' : ''}${globalIdx === clampedHighlighted ? ' highlighted' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectConverter(c) }}
                      onMouseEnter={() => setHighlighted(globalIdx)}
                    >
                      <span className="tool-picker-tool-name">{c.name}</span>
                      <span className="tool-picker-tool-cat">{c.categoryName || c.category}</span>
                      <ExperimentalBadge tool={c} />
                    </div>
                  )
                })}
              </div>
            )}
            {searchFormats.length === 0 && searchTools.length === 0 && (
              <div className="tool-picker-empty">No results</div>
            )}
          </>
        )}

        {/* "to" mode: show all valid target formats grouped */}
        {isToMode && (
          <>
            {Object.entries(toGrouped).map(([group, items]) => (
              <div key={group} className="tool-picker-section">
                <div className="tool-picker-section-label">{group}</div>
                {items.map(f => {
                  const idx = toFormatIndexMap.get(f) ?? -1
                  return (
                    <div
                      key={f.id}
                      data-picker-item
                      className={`tool-picker-format-item${f.id === currentFormatValue ? ' selected' : ''}${idx === clampedHighlighted ? ' highlighted' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectFormat(f.id) }}
                      onMouseEnter={() => setHighlighted(idx)}
                    >
                      <span className="tool-picker-format-name">{f.name}</span>
                      {f.id === currentFormatValue && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            {toFlatFormats.length === 0 && (
              <div className="tool-picker-empty">No formats found</div>
            )}
          </>
        )}

        {/* Tab mode: formats + tools for current tab */}
        {!isSearchMode && !isToMode && (
          <>
            {hasTabFormats && Object.entries(tabGrouped).map(([group, items]) => (
              <div key={group} className="tool-picker-section">
                <div className="tool-picker-section-label">{group}</div>
                {items.map(f => {
                  const idx = tabFormatIndexMap.get(f) ?? -1
                  return (
                    <div
                      key={f.id}
                      data-picker-item
                      className={`tool-picker-format-item${f.id === currentFormatValue ? ' selected' : ''}${idx === clampedHighlighted ? ' highlighted' : ''}`}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectFormat(f.id) }}
                      onMouseEnter={() => setHighlighted(idx)}
                    >
                      <span className="tool-picker-format-name">{f.name}</span>
                      {f.id === currentFormatValue && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

            {hasTabFormats && hasTabTools && (
              <div className="tool-picker-section">
                <div className="tool-picker-section-label">Tools</div>
              </div>
            )}

            {hasTabTools && (
              <div className="tool-picker-tool-grid">
                {tabTools.map(c => {
                  const idx = tabToolIndexMap.get(c) ?? -1
                  return (
                    <div
                      key={c.id}
                      data-picker-item
                      className={`tool-picker-tool-card${c.id === currentConverterValue ? ' selected' : ''}${idx === clampedHighlighted ? ' highlighted' : ''}`}
                      data-category={c.category}
                      onMouseDown={(e) => { e.preventDefault(); handleSelectConverter(c) }}
                      onMouseEnter={() => setHighlighted(idx)}
                    >
                      <span className="tool-picker-tool-card-name">{c.name}</span>
                      <span className="tool-picker-tool-card-desc">{c.description}</span>
                      <ExperimentalBadge tool={c} />
                    </div>
                  )
                })}
              </div>
            )}

            {!hasTabFormats && !hasTabTools && (
              <div className="tool-picker-empty">No items in this category</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ToolPicker(props) {
  const { open, mode, currentFormatValue, currentConverterValue } = props
  if (!open) return null
  return (
    <ToolPickerContent
      key={`${mode}|${currentFormatValue || ''}|${currentConverterValue || ''}`}
      {...props}
    />
  )
}

export default ToolPicker
