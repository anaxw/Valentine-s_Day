import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaCamera, FaHeart } from 'react-icons/fa';

interface Memory {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  icon: string;
}

interface MemoryCardProps {
  memory: Memory;
  index: number;
  onRecall: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, index, onRecall }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="memory-card"
      onClick={onRecall}
    >
      <div className="card-icon">
        <span>{memory.icon}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRecall();
          }}
          className="heart-button"
        >
          <FaHeart className="text-red-400" size={20} />
        </motion.button>
      </div>
      
      <div className="card-content">
        <div className="card-date">
          <FaCalendar size={14} />
          <span>{memory.date}</span>
        </div>
        <h3 className="card-title">{memory.title}</h3>
        <p className="card-description">{memory.description}</p>
        
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          className="card-divider"
        />
      </div>
    </motion.div>
  );
};

export default MemoryCard;