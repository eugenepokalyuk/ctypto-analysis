import React from 'react'

import { AnimatePresence, motion, useDragControls } from 'framer-motion'

import classes from './Drawer.module.scss'

interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Drawer({ open, onClose, children }: Props) {
  const controls = useDragControls()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={classes.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            className={classes.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 42, mass: 0.8 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.25 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) onClose()
            }}
          >
            <div
              className={classes.handle}
              onPointerDown={e => controls.start(e)}
            >
              <div className={classes.handleBar} />
            </div>
            <div className={classes.content}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
