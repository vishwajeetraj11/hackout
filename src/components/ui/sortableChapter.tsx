import React from 'react'

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const SortableChapter = ({chapter}) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: chapter.id })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
        {chapter}
      </div>  
    )
}

export default SortableChapter;