import { WobbleCard } from '../../ui/wobble-card';
import './LandingFuncionalidad.css';
import biblioteca from '../../../assets/images/biblioteca.png';
import reseña from '../../../assets/images/reseña.png';


export default function Funcionalidad() {
    return (
        <section className="contenedor">
            <div className='header'>
                <h1>Funcionalidad</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
                
                {/* Card grande - Biblioteca (naranja) */}
                <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[300px] !bg-[#FF6B35]">
                    <div className="max-w-xs">
                        <h2 className="text-left text-3xl font-semibold text-white"
                            style={{ fontFamily: 'ClashDisplay-Bold, sans-serif' }}>
                            Biblioteca
                        </h2>
                        <p className="mt-4 text-left text-base/6 text-white/80"
                           style={{ fontFamily: 'ClashDisplay-Medium, sans-serif' }}>
                            Guarda y organiza tus álbumes favoritos. Lleva el control de lo que escuchas y crea tu colección personal.
                        </p>
                    </div>
                    <img
                        src={biblioteca}
                        width={500}
                        height={500}
                        alt="Vista de la biblioteca"
                        className="absolute -right-4 lg:-right-[20%] -bottom-12 object-contain rounded-2xl"
                    />
                </WobbleCard>

                {/* Card pequeña - Comunidad (negro) */}
                <WobbleCard containerClassName="col-span-1 min-h-[300px] !bg-[#1b1b2e]">
                    <h2 className="text-left text-3xl font-semibold text-white"
                        style={{ fontFamily: 'ClashDisplay-Bold, sans-serif' }}>
                        Comunidad
                    </h2>
                    <p className="mt-4 text-left text-base/6 text-white/80"
                       style={{ fontFamily: 'ClashDisplay-Medium, sans-serif' }}>
                        Comparte tus opiniones musicales con amigos. Conecta y comenta sus reviews.
                    </p>
                </WobbleCard>

                {/* Card pequeña - Listas (naranja) */}
                <WobbleCard containerClassName="col-span-1 min-h-[300px] !bg-[#0c0c23]">
                    <h2 className="text-left text-3xl font-semibold text-white"
                        style={{ fontFamily: 'ClashDisplay-Bold, sans-serif' }}>
                        Listas
                    </h2>
                    <p className="mt-4 text-left text-base/6 text-white/80"
                       style={{ fontFamily: 'ClashDisplay-Medium, sans-serif' }}>
                        Diseña listas temáticas para cada momento. Compártelas con tu comunidad y descubre las colecciones de otros usuarios.
                    </p>
                </WobbleCard>

                {/* Card grande - Reseñas (negro) */}
                <WobbleCard containerClassName="col-span-1 lg:col-span-2 min-h-[300px] !bg-[#FF6B35]">
                    <div className="max-w-sm">
                        <h2 className="text-left text-3xl font-semibold text-white"
                            style={{ fontFamily: 'ClashDisplay-Bold, sans-serif' }}>
                            Reseñas
                        </h2>
                        <p className="mt-4 text-left text-base/6 text-white/80"
                           style={{ fontFamily: 'ClashDisplay-Medium, sans-serif' }}>
                            Escribe reseñas a tu ritmo, profundas como un crítico profesional o pensamientos rápidos.
                        </p>
                    </div>
                    <img
                        src={reseña}
                        width={500}
                        height={500}
                        alt="Vista de reseñas"
                        className="absolute -right-10 md:-right-[40%] lg:-right-[15%] -bottom-10 object-contain rounded-2xl"
                    />
                </WobbleCard>

            </div>
        </section>
    );
}