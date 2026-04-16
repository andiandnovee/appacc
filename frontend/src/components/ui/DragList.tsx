import { FC, ReactNode, ReactElement, useState, useRef } from 'react'
import { GripVertical } from 'lucide-react'
import styles from './DragList.module.css'

interface DragListProps {
  items?: any
  onChange?: any
}


/**
 * DragList — Drag & drop list (HTML5 DnD API, tanpa library tambahan)
 *
 * Props:
 * - items      → array of { id, content: React node, actions?: React node }
 * - onChange   → (reorderedItems) => void
 *
 * Contoh:
 * items={[
 *   { id: '1', content: <span>Item satu</span> },
 *   { id: '2', content: <span>Item dua</span>, actions: <Button>Edit</Button> },
 * ]}
 */
const DragList: FC<DragListProps> = ({  items = [], onChange  }) => {
  const [list,     setList]     = useState(items)
  const [dragging, setDragging] = useState(null)  // id yang sedang di-drag
  const [over,     setOver]     = useState(null)   // id yang di-hover saat drag
  const dragIndex  = useRef(null)

  const handleDragStart = (e, id, i) => {
    setDragging(id)
    dragIndex.current = i
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOver(id)
  }

  const handleDrop = (e, targetId, targetIndex) => {
    e.preventDefault()
    if (dragging === targetId) return

    const next = [...list]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(targetIndex, 0, moved)

    setList(next)
    onChange?.(next)
    setDragging(null)
    setOver(null)
  }

  const handleDragEnd = () => {
    setDragging(null)
    setOver(null)
  }

  return (
    <div className={styles.list} role="list">
      {list.map((item, i) => (
        <div
          key={item.id}
          role="listitem"
          className={[
            styles.item,
            dragging === item.id ? styles.itemDragging : '',
            over === item.id && dragging !== item.id ? styles.itemOver : '',
          ].filter(Boolean).join(' ')}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id, i)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={(e) => handleDrop(e, item.id, i)}
          onDragEnd={handleDragEnd}
          aria-grabbed={dragging === item.id}
        >
          <span className={styles.handle} aria-hidden="true">
            <GripVertical size={16} />
          </span>
          <div className={styles.content}>{item.content}</div>
          {item.actions && <div className={styles.actions}>{item.actions}</div>}
        </div>
      ))}
    </div>
  )
}
