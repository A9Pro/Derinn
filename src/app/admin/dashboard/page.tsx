import { prisma } from "@/lib/prisma";
import AnimatedNumber from "@/components/admin/AnimatedNumber";

interface DashboardCard {
  label: string;
  value: number;
  prefix?: string;
}

async function getDashboardStats() {
  try {
    const [totalUsers, totalProducts, revenueData] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
    ]);

    return {
      totalUsers,
      totalProducts,
      revenue: revenueData._sum.total || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalUsers: 0,
      totalProducts: 0,
      revenue: 0,
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards: DashboardCard[] = [
    { 
      label: "Total Users", 
      value: stats.totalUsers 
    },
    { 
      label: "Total Products", 
      value: stats.totalProducts 
    },
    { 
      label: "Total Revenue", 
      value: stats.revenue,
      prefix: "₦"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-xl hover:from-white/10 hover:to-white/15 transition-all duration-300"
          >
            <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-4">
              {card.label}
            </p>
            <p className="text-5xl font-bold text-white">
              {card.prefix && <span className="text-green-400">{card.prefix}</span>}
              <AnimatedNumber value={card.value} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}