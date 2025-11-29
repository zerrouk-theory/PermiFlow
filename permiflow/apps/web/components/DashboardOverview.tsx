import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { demoWallet, mockBets, mockTowns } from "@/data/mock";
import { Card } from "./ui/Card";
import { Table } from "./ui/Table";

const headers = ["Ville", "Sens", "Montant", "Échéance", "Statut"];

export const DashboardOverview = () => {
  const upcomingExpiry = format(
    addDays(new Date(), 7),
    "dd MMM",
    { locale: fr },
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Solde disponible" subtitle="Wallet + Stripe" className="bg-gradient-to-br from-[#1E3A8A]/70 to-[#0f172a]">
          <p className="text-3xl font-semibold text-white">
            € {demoWallet.balance.toLocaleString("fr-FR")}
          </p>
          <p className="text-xs text-slate-400">
            Gains cumulés : € {demoWallet.totalGain.toLocaleString("fr-FR")}
          </p>
        </Card>
        <Card title="Paris ouverts" subtitle="Actifs">
          <p className="text-3xl font-semibold text-white">
            {mockBets.filter((bet) => bet.status === "OPEN").length}
          </p>
          <p className="text-xs text-slate-400">
            Prochain règlement : {upcomingExpiry}
          </p>
        </Card>
        <Card title="Score moyen IRIS" subtitle="Top 6 suivis">
          <p className="text-3xl font-semibold text-white">
            {Math.round(
              mockTowns.reduce((sum, town) => sum + town.score, 0) /
                mockTowns.length,
            )}
          </p>
          <p className="text-xs text-slate-400">
            {mockTowns[0].name.split("—")[0]} domine l&rsquo;activité
          </p>
        </Card>
      </div>

      <Card title="Historique des paris" subtitle="Synthèse manuelle">
        <Table
          headers={headers}
          rows={mockBets.map((bet) => {
            const town = mockTowns.find((item) => item.irisCode === bet.townId);
            return [
              <div key={`${bet.id}-town`}>
                <p className="font-semibold text-white">{town?.name ?? "IRIS"}</p>
                <p className="text-xs text-slate-400">{town?.region}</p>
              </div>,
              <span
                key={`${bet.id}-dir`}
                className={`text-sm font-semibold ${
                  bet.direction === "UP" ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {bet.direction === "UP" ? "Hausse" : "Baisse"}
              </span>,
              <span key={`${bet.id}-amount`} className="text-white">
                € {bet.amount.toLocaleString("fr-FR")}
              </span>,
              <span key={`${bet.id}-expiry`} className="text-slate-300">
                {new Date(bet.expiry).toLocaleDateString("fr-FR")}
              </span>,
              <span key={`${bet.id}-status`} className="text-xs uppercase tracking-wide text-slate-400">
                {bet.status}
              </span>,
            ];
          })}
        />
      </Card>
    </div>
  );
};
