import { useState, useEffect } from 'react';
import { getAllInvitados, updateEstadoPago, deleteInvitado, type Invitado } from '../services/rsvpService';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [invitados, setInvitados] = useState<Invitado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendiente' | 'en_revision' | 'aprobado' | 'declined'>('todos');
  const [selectedProofUrl, setSelectedProofUrl] = useState<{ url: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitados();
  }, []);

  const fetchInvitados = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInvitados();
      setInvitados(data);
    } catch (err) {
      console.error('Error al cargar invitados:', err);
      setError('No se pudieron cargar los datos de los invitados.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado') => {
    setActionLoading(id);
    try {
      await updateEstadoPago(id, newStatus);
      setInvitados((prev) =>
        prev.map((item) => (item.id === id ? { ...item, estadoPago: newStatus } : item))
      );
    } catch (err) {
      console.error('Error actualizando estado:', err);
      alert('Error al actualizar el estado de pago.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la confirmación de ${name}?`)) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteInvitado(id);
      setInvitados((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error al eliminar invitado:', err);
      alert('Error al eliminar el registro.');
    } finally {
      setActionLoading(null);
    }
  };

  // Metrics calculation
  const totalConfirmados = invitados.filter((i) => i.asistencia === 'attending');
  const totalPersonas = totalConfirmados.reduce((acc, curr) => acc + (curr.invitados || 1), 0);
  const totalPagosAprobados = totalConfirmados.filter((i) => i.estadoPago === 'aprobado');
  const totalRecaudado = totalPagosAprobados.reduce((acc, curr) => acc + (curr.montoTotal || 0), 0);
  const totalComprobantesPendientes = totalConfirmados.filter((i) => i.estadoPago === 'en_revision').length;

  // Filtered list
  const filteredList = invitados.filter((item) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.telefono.includes(searchTerm);

    if (!matchesSearch) return false;

    if (statusFilter === 'todos') return true;
    if (statusFilter === 'declined') return item.asistencia === 'declined';
    return item.asistencia === 'attending' && item.estadoPago === statusFilter;
  });

  return (
    <div className="min-h-screen bg-[#F0F4F2] py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#1D373C]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#0B272D]/10">
          <div>
            <span className="text-[#5A9696] font-bold text-xs uppercase tracking-widest">
              PANEL DE CONTROL · BODA 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#0B272D] mt-1">
              Gestión de Invitados & Pagos
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Sesión iniciada como: <span className="font-semibold text-[#0B272D]">{user?.email}</span>
            </p>
          </div>

          <button
            onClick={fetchInvitados}
            className="px-4 py-2 bg-white hover:bg-[#BBDB93] border border-[#0B272D]/20 rounded-xl text-xs font-bold text-[#0B272D] transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>🔄</span>
            <span>Actualizar Datos</span>
          </button>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-sm">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
              Personas Confirmadas
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#0B272D]">
              {totalPersonas}
            </span>
            <span className="text-[11px] text-[#5A9696] block mt-1">
              en {totalConfirmados.length} reservas
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-sm">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
              Recaudado (Aprobado)
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#0B272D]">
              ${totalRecaudado.toLocaleString('es-AR')}
            </span>
            <span className="text-[11px] text-[#5A9696] block mt-1">
              {totalPagosAprobados.length} pagos verificados
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-sm">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
              Comprobantes por Revisar
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-[#8C5A00]">
              {totalComprobantesPendientes}
            </span>
            <span className="text-[11px] text-gray-500 block mt-1">
              requieren tu validación
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#0B272D]/10 shadow-sm">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block mb-1">
              No Asistirán
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-400">
              {invitados.filter((i) => i.asistencia === 'declined').length}
            </span>
            <span className="text-[11px] text-gray-500 block mt-1">
              agradecieron invitación
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#0B272D]/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#F7FAF9] border border-[#0B272D]/20 text-xs text-[#0B272D] placeholder-[#426B6B]/60 focus:outline-none focus:ring-2 focus:ring-[#5A9696]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['todos', 'en_revision', 'pendiente', 'aprobado', 'declined'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === tab
                    ? 'bg-[#0B272D] text-white'
                    : 'bg-[#F0F4F2] text-[#0B272D] hover:bg-[#E0E8E5]'
                }`}
              >
                {tab === 'todos' && 'Todos'}
                {tab === 'en_revision' && '⏳ En Revisión'}
                {tab === 'pendiente' && '⚠️ Pendientes'}
                {tab === 'aprobado' && '✓ Aprobados'}
                {tab === 'declined' && '✕ No Asisten'}
              </button>
            ))}
          </div>
        </div>

        {/* INVITADOS TABLE */}
        <div className="bg-white rounded-3xl border border-[#0B272D]/10 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-4 border-[#BBDB93] border-t-[#0B272D] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-gray-500">Cargando invitados...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-[#8C1C00] text-sm font-semibold">
              ⚠️ {error}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No se encontraron registros con los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7FAF9] border-b border-[#0B272D]/10 text-gray-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Invitado</th>
                    <th className="py-4 px-4">Teléfono</th>
                    <th className="py-4 px-4">Lugares</th>
                    <th className="py-4 px-4">Monto</th>
                    <th className="py-4 px-4">Estado Pago</th>
                    <th className="py-4 px-4">Comprobante</th>
                    <th className="py-4 px-4">Mensaje / Canción</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B272D]/5">
                  {filteredList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F9FBFA] transition-colors">
                      {/* Name */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#0B272D]">
                          {item.nombre} {item.apellido}
                        </div>
                        {item.restriccionAlimentaria && item.restriccionAlimentaria !== 'ninguno' && (
                          <span className="text-[10px] text-[#5A9696] font-medium block">
                            Dieta: {item.restriccionAlimentaria}
                          </span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 font-mono text-[#0B272D]">
                        <a
                          href={`https://api.whatsapp.com/send?phone=${item.telefono}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline text-[#5A9696] font-semibold"
                        >
                          {item.telefono}
                        </a>
                      </td>

                      {/* Guest count */}
                      <td className="py-4 px-4">
                        {item.asistencia === 'attending' ? (
                          <span className="font-bold text-[#0B272D]">
                            {item.invitados} {item.invitados > 1 ? 'personas' : 'persona'}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">No asiste</span>
                        )}
                      </td>

                      {/* Total amount */}
                      <td className="py-4 px-4 font-bold text-[#0B272D]">
                        {item.montoTotal ? `$${item.montoTotal.toLocaleString('es-AR')}` : '-'}
                      </td>

                      {/* Payment status badge */}
                      <td className="py-4 px-4">
                        {item.asistencia === 'declined' ? (
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            No Aplica
                          </span>
                        ) : item.estadoPago === 'aprobado' ? (
                          <span className="bg-[#BBDB93] text-[#0B272D] px-2.5 py-1 rounded-full text-[10px] font-bold">
                            ✓ Aprobado
                          </span>
                        ) : item.estadoPago === 'en_revision' ? (
                          <span className="bg-[#E0E8E5] text-[#0B272D] px-2.5 py-1 rounded-full text-[10px] font-bold">
                            ⏳ En Revisión
                          </span>
                        ) : (
                          <span className="bg-[#FAF0E6] text-[#8C5A00] px-2.5 py-1 rounded-full text-[10px] font-bold">
                            ⚠️ Pendiente
                          </span>
                        )}
                      </td>

                      {/* Comprobante link */}
                      <td className="py-4 px-4">
                        {item.comprobanteUrl ? (
                          <button
                            type="button"
                            onClick={() => setSelectedProofUrl({ url: item.comprobanteUrl!, name: item.comprobanteNombre || 'Comprobante' })}
                            className="font-bold text-[#5A9696] hover:text-[#0B272D] underline inline-flex items-center gap-1"
                          >
                            <span>📄</span>
                            <span>Ver archivo</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px] italic">Sin comprobante</span>
                        )}
                      </td>

                      {/* Extra message / song */}
                      <td className="py-4 px-4 max-w-xs truncate text-[11px] text-gray-600">
                        {item.mensaje && <p className="truncate" title={item.mensaje}>💬 {item.mensaje}</p>}
                        {item.cancion && <p className="truncate" title={item.cancion}>🎵 {item.cancion}</p>}
                        {!item.mensaje && !item.cancion && <span className="text-gray-300">-</span>}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-right space-x-2">
                        {item.asistencia === 'attending' && item.estadoPago !== 'aprobado' && (
                          <button
                            onClick={() => handleStatusChange(item.id, 'aprobado')}
                            disabled={actionLoading === item.id}
                            className="px-2.5 py-1 bg-[#BBDB93] hover:bg-[#A3C775] text-[#0B272D] rounded-lg font-bold text-[10px] transition-colors"
                            title="Aprobar pago"
                          >
                            ✓ Aprobar
                          </button>
                        )}
                        {item.asistencia === 'attending' && item.estadoPago === 'aprobado' && (
                          <button
                            onClick={() => handleStatusChange(item.id, 'pendiente')}
                            disabled={actionLoading === item.id}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-[10px] transition-colors"
                            title="Marcar como pendiente"
                          >
                            Deshacer
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id, `${item.nombre} ${item.apellido}`)}
                          disabled={actionLoading === item.id}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-[10px] transition-colors"
                          title="Eliminar invitado"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* PROOF PREVIEW MODAL */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0B272D] truncate">
                {selectedProofUrl.name}
              </h3>
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
              {selectedProofUrl.url.toLowerCase().includes('.pdf') ? (
                <iframe
                  src={selectedProofUrl.url}
                  className="w-full h-[600px] border-none rounded-xl"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={selectedProofUrl.url}
                  alt="Comprobante"
                  className="max-h-[600px] object-contain rounded-xl shadow-sm"
                />
              )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-white">
              <a
                href={selectedProofUrl.url}
                target="_blank"
                rel="noreferrer"
                download
                className="px-4 py-2 bg-[#0B272D] text-white text-xs font-bold rounded-xl hover:bg-[#051518]"
              >
                Descargar / Abrir en pestaña nueva ↗
              </a>
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
