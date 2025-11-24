import React from 'react'

export const Separator: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={className} data-testid="separator" />
)

export default Separator
