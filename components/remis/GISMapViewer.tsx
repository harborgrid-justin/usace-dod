import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { 
    Map as MapIcon, Layers, Plus, MapPin, Navigation, 
    Maximize, ZoomIn, ZoomOut, Eye, EyeOff, 
    ShieldCheck, CheckCircle2, 
    Trash2, Save, History, Move, FileText, X
} from 'lucide-react';
import { GeospatialFeature, GeoLifecycleState, GeoLayer } from '../../types';
import { formatRelativeTime } from '../../utils/formatting';
import { remisService } from '../../services/RemisDataService';

const GISMapViewer: React.FC = () => {
    const [features, setFeatures] = useState<GeospatialFeature[]>(remisService.getFeatures());
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    const [activeLayers, setActiveLayers] = useState<Record<GeoLayer, boolean>>({
        'Real Property': true,
        'Tasks': true,
        'Encumbrance': true,
        'Environment': false
    });
    const [mode, setMode] = useState<'Pan' | 'Identify' | 'Digitize'>('Pan');
    const [zoom, setZoom] = useState(100);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const unsubscribe = remisService.subscribe(() => {
            setFeatures([...remisService.getFeatures()]);
        });
        return unsubscribe;
    }, []);

    const selectedFeature = useMemo(() => 
        features.find(f => f.id === selectedFeatureId),
    [features, selectedFeatureId]);

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (mode === 'Digitize') {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            const newFeature: GeospatialFeature = {
                id: `GEO-${Date.now()}`,
                assetName: 'Digitized Point',
                type: 'Point',
                status: 'Draft',
                layer: 'Real Property',
                coordinates: { x, y },
                metadata: {
                    source: 'Manual Digitization',
                    accuracy: 'Est ±5m',
                    collectionMethod: 'Desktop GIS',
                    captureDate: new Date().toISOString().split('T')[0],
                    responsibleOfficial: 'Current User'
                },
                auditLog: []
            };
            startTransition(() => {
                remisService.addFeature(newFeature);
                setSelectedFeatureId(newFeature.id);
                setMode('Identify');
            });
        } else {
            if (e.target === e.currentTarget) setSelectedFeatureId(null);
        }
    };

    const updateFeatureStatus = (status: GeoLifecycleState) => {
        if (!selectedFeature) return;
        startTransition(() => {
            remisService.updateFeature({ ...selectedFeature, status });
        });
    };

    return (
        <div className={`flex flex-col md:flex-row h-full bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700 relative animate-in fade-in transition-opacity ${isPending ? 'opacity-70' : 'opacity-100'}`}>
            {/* GIS Toolbar */}
            <div className="md:w-14 bg-zinc-800 border-r border-zinc-700 flex flex-row md:flex-col items-center py-4 gap-4 z-20 shrink-0">
                <button onClick={() => setMode('Pan')} className={`p-2.5 rounded-xl transition-all ${mode === 'Pan' ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-white'}`}><Move size={20} /></button>
                <button onClick={() => setMode('Digitize')} className={`p-2.5 rounded-xl transition-all ${mode === 'Digitize' ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-white'}`}><Plus size={20} /></button>
                <div className="h-px w-8 bg-zinc-700 my-2 hidden md:block" />
                <button onClick={() => setZoom(z => Math.min(z + 10, 200))} className="p-2.5 text-zinc-500 hover:text-white"><ZoomIn size={20} /></button>
                <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className="p-2.5 text-zinc-500 hover:text-white"><ZoomOut size={20} /></button>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 relative overflow-hidden bg-[#1e1e1e] cursor-crosshair" onClick={handleMapClick}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)', backgroundSize: '40px 40px', transform: `scale(${zoom / 100})` }} />
                
                <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center center' }}>
                    {features.map(feature => (
                        <div 
                            key={feature.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedFeatureId(feature.id); }}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${selectedFeatureId === feature.id ? 'z-50 scale-125' : 'z-10 hover:scale-110'}`}
                            style={{ left: `${feature.coordinates.x}%`, top: `${feature.coordinates.y}%` }}
                        >
                            <div className={`p-2 rounded-full shadow-lg border-2 ${feature.layer === 'Real Property' ? 'bg-emerald-600' : 'bg-blue-600'} border-white`}>
                                <MapPin size={16} className="text-white" fill="currentColor" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Properties Panel */}
            {selectedFeature && (
                <div className="w-full md:w-80 bg-zinc-800 border-l border-zinc-700 flex flex-col animate-in slide-in-from-right">
                    <div className="p-4 bg-zinc-900 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-white">{selectedFeature.assetName}</h3>
                        <button onClick={() => setSelectedFeatureId(null)} className="text-zinc-500 hover:text-white"><X size={16}/></button>
                    </div>
                    <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Metadata Registry</h4>
                            <div className="bg-zinc-900/50 rounded-xl p-4 space-y-3 text-xs">
                                <div className="flex justify-between"><span className="text-zinc-500">Accuracy</span><span className="text-zinc-300">{selectedFeature.metadata.accuracy}</span></div>
                                <div className="flex justify-between"><span className="text-zinc-500">Method</span><span className="text-zinc-300">{selectedFeature.metadata.collectionMethod}</span></div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-zinc-700">
                             <button onClick={() => updateFeatureStatus('Published')} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg shadow-emerald-900/20">
                                Certify & Publish Logic
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GISMapViewer;