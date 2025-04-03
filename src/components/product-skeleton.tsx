// ProductSkeleton component
export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm border border-gray-100 animate-pulse">
      <div className="w-full h-32 bg-gray-200 rounded-xl mb-2"></div>
      <div className="w-2/3 h-4 bg-gray-200 rounded mt-1 mb-1"></div>
      <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
    </div>
  );
}
