import { EditPlayerAdminForm } from "@/sections/Admin/Players/Edit/editPlayerForm";

export default async function AdminEditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playerId = parseInt(id);

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Jugador</h1>
        <p className="text-gray-600 mt-2">
          Administra la información y configuración del jugador
        </p>
      </div>

      <EditPlayerAdminForm playerId={playerId} />
    </div>
  );
}
