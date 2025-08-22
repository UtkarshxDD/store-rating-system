const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
      {children}
    </div>
  );
  
  export default Card;
  