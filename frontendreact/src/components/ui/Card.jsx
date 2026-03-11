export default function Card({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">

      <p className="text-gray-500 dark:text-gray-200 **:text-sm">
        {title}
      </p>

      <h2 className="text-2xl dark:text-gray-100 font-bold mt-2">
        {value}
      </h2>

    </div>
  )
}
