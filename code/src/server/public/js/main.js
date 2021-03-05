window.onload = web;

function web() {
    /* Conexión con el servidor */
    const socket = io();

    socket.on('connect', () => {
        socket.emit('clt:active', 'Me he conectado correctamente!');
        /* CODIGO */
        /**
         * El ChatBot no funciona sin conexión al servidor de Socket.io, si no se conecta no funciona.
         * Mientras se carga la pagina no se podrá usar nada.
         * Notas:
         * - La pagina va a esperar al servidor haste que se conecte.
         * Todo el codigo funcionará cuando se conecte al servidor.
         */
        /* Funciones del menu */
        const $menu__perfil_btn = document.getElementsByClassName('menu__perfil-btn');
        const $perfil_menu = document.getElementsByClassName('perfil-menu');
        const $perfil__datos_usuario = document.getElementById('perfil__datos-usuario');
        const $perfil__sistema_id = document.getElementById('perfil__sistema-id');
        const $perfil__sistema_version = document.getElementById('perfil__sistema-version');
        const $opciones__general_servidor = document.getElementById('opciones__general-servidor');
        const $output = document.getElementById('output');
        const $send = document.getElementById('send');
        const $message = document.getElementById('message');

        $menu__perfil_btn[0].addEventListener('click', (e) => {
            $perfil_menu[0].classList.toggle('perfil-visible');
        });

        /* Modificar HTML con los datos del servidor y el cliente */
        socket.on('srv:welcome', (info) => {
            if (info.client.permission) {
                $perfil__datos_usuario.innerText = info.client.id;
                $perfil__sistema_id.innerText = info.client.id;
                $perfil__sistema_version.innerText = info.server.version;
                setTimeout(() => {
                    $opciones__general_servidor.innerHTML = info.server.location;
                }, 750);
                Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                }).fire({
                    icon: 'success',
                    title: 'Bienvenido!'
                });
                $(function() {
                    /*
                     * Aqui empieza el codigo del chatbot
                     * Lo otro solo conectaba el servidor
                     */
                    socket.on('prueba', (data) => {
                        console.log(c`Mensaje del servidor: ${data}.bold.green`.underline.red);
                    });
                    socket.emit('clt:ready', true);
                    socket.emit('ctl:talk', true);
                    socket.on('srv:msg', (data) => {
                        var template = `<div class="output__bot msg">
                            <div class="bot__info">
                                <img src="../img/descargar.png" class="bot__info-img"></img>
                                <p class="bot__info-autor">${data.author}: </p>
                            </div>
                            <div class="bot__msg">
                                <p class="bot__msg-txt">${data.msg.text}</p>`;
                        if (data.msg.embed !== undefined) {
                            var embed = data.msg.embed;
                            var embed_template = `<div class="bot__msg-embed embed embed-${embed.color}">
                                <h3 class="embed__title">${embed.title}</h3>
                                <p class=""embed__txt">${embed.txt}</p>`;
                            if (embed.fields) {
                                embed_template += `    <div class="embed__fields">`;
                                for (let i = 0; i < embed.fields.length; i++) {
                                    embed_template += `<div>
                                                <p class="embed__fields-name">
                                                    <b>${embed.fields[i].name}</b>
                                                </p>
                                                <p class="embed__fields-value">${embed.fields[i].value}</p>
                                            </div>`;
                                }
                                embed_template += `    </div>`;
                            }
                            embed_template += `</div>`;
                            template += embed_template;
                        }
                        template += `    </div>
                        </div>`;
                        $output.innerHTML += template;
                    });
                    $send.addEventListener('click', (e) => {
                        if (window.getComputedStyle($send).getPropertyValue('border-bottom-color') == 'rgb(255, 255, 255)') {
                            $send.style.borderBottomColor = 'orange';
                            const msg = $message.value;
                            socket.emit('usr:msg', {
                                msg: msg
                            });
                        } else {
                            Swal.mixin({
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            }).fire({
                                icon: 'warning',
                                title: 'Espera a que se envie al mensaje anterior y pasen 3 segundos!',
                                text: ' - Sistema anti spam'
                            });
                        }
                    });
                    $message.addEventListener('keyup', (e) => {
                        if (e.keyCode == 13) {
                            if (window.getComputedStyle($send).getPropertyValue('border-bottom-color') == 'rgb(255, 255, 255)') {
                                $send.style.borderBottomColor = 'orange';
                                const msg = $message.value;
                                socket.emit('usr:msg', {
                                    msg: msg
                                });
                            } else {
                                Swal.mixin({
                                    toast: true,
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
                                    didOpen: (toast) => {
                                        toast.addEventListener('mouseenter', Swal.stopTimer)
                                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                                    }
                                }).fire({
                                    icon: 'warning',
                                    title: 'Espera a que se envie al mensaje anterior!',
                                    text: ' - Sistema anti spam'
                                });
                            }
                        }
                    });
                    socket.on('usr:msg', (data) => {
                        if (data.msg.text == $message.value) {
                            if ($output.lastChild.classList.contains('output__usr')) {
                                var template = `<div class="output__usr msg">
                                    <div class="usr__info-invisible">
                                        <img src="../img/usr.png" class="usr__info-img"></img>
                                        <p class="usr__info-autor">${data.author}: </p>
                                    </div>
                                    <div class="usr__msg">
                                        <p class="usr__msg-txt">${data.msg.text}</p>`;
                                template += `    </div>
                                </div>`;
                            } else {
                                var template = `<div class="output__usr msg">
                                    <div class="usr__info">
                                        <img src="../img/usr.png" class="usr__info-img"></img>
                                        <p class="usr__info-autor">${data.author}: </p>
                                    </div>
                                    <div class="usr__msg">
                                        <p class="usr__msg-txt">${data.msg.text}</p>`;
                                template += `    </div>
                                </div>`;
                            
                            }
                            $output.innerHTML += template;
                            $send.style.borderBottomColor = 'green';
                            $message.value = '';
                            setTimeout(() => {
                                $send.style.borderBottomColor = 'white';
                            }, 3000);
                        } else {
                            $send.style.borderBottomColor = 'red';
                            Swal.fire({
                                icon: 'error',
                                title: 'Oh...',
                                text: 'Ha ocurrido un error!',
                                footer: '<a href>Error x003</a>',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                allowEnterKey: false,
                                showConfirmButton: false
                            });
                        }
                        // Nota: falta poner que los usuarios puedan mandar embeds
                        // Nota: no se como lo voy a hacer
                    });
                    // Fin del codigo del ChatBot
                    // Inicio del codigo del juego de los juegos
                    const juegos = {
                        cuatroenraya: () => {
                            // Configuracion
                            const config = {
                                juego: {
                                    tablero: {
                                        filas: 6,
                                        columnas: 7
                                    },
                                    colores: {
                                        null: "#FFFFFF",
                                        humano: "#FF00FF",
                                        ia: "00FFFF"
                                    },
                                    objetivo: 10
                                },
                                msg: {
                                    inicio: 'Iniciado 4 en raya'
                                }
                            }

                            // Tablero
                            const lienzo = {
                                svg: {
                                    id: 'area-juegos',
                                    clases: [
                                        'area-juegos'
                                    ],
                                    width: 600,
                                    height: 650,
                                    html: null,
                                    ns: "http://www.w3.org/2000/svg"
                                },
                                tablero: {
                                    elementos: []
                                }
                            };

                            // Configurar pagina
                            console.log(config.msg.inicio);

                            // Constantes
                            const FILAS = config.juego.tablero.filas;
                            const COLUMNAS = config.juego.tablero.columnas;
                            const SVG_NS = lienzo.svg.ns;
                            const COLOR0 = config.juego.colores.null;
                            const COLOR_HUMANO = config.juego.colores.humano;
                            const COLOR_IA = config.juego.colores.ia;
                            const OBJETIVO = config.juego.objetivo;

                            // Variables
                            var svg = null;
                            var radio = 40;

                            // Acciones
                            const acciones = {
                                iniciarPartida: () => {
                                    for (let i = 0; i < FILAS; i++) {
                                        for (let j = 0; j < COLUMNAS; j++) {
                                            acciones.dibujarCirculo(i, j);
                                        }
                                    }
                                    console.log(lienzo);
                                },
                                dibujarCirculo: (i, j) => {
                                    var c = document.createElementNS(SVG_NS, 'circle');
                                    var cx = 5 + radio + j * (5 + radio * 2);
                                    var cy = 55 + radio + i * (5 + radio * 2);
                                    var cconfig = {
                                        cordenadas: {
                                            cx: cx,
                                            cy: cy
                                        },
                                        atributos: {
                                            radio: radio,
                                            fondo: config.juego.colores.null,
                                            borde: 'black',
                                            ancho_borde: 3
                                        }
                                    }
                                    c.setAttribute('cx', cconfig.cordenadas.cx);
                                    c.setAttribute('cy', cconfig.cordenadas.cy);
                                    c.setAttribute('r', cconfig.atributos.radio);
                                    c.style.fill = cconfig.atributos.fondo;
                                    c.style.stroke = cconfig.atributos.borde;
                                    c.style.strokeWidth = cconfig.atributos.ancho_borde;
                                    lienzo.tablero.elementos[lienzo.tablero.elementos.length] = {
                                        tipo: 'circulo',
                                        elemento: c,
                                        configuracion: cconfig
                                    }
                                    svg.appendChild(lienzo.tablero.elementos[lienzo.tablero.elementos.length - 1].elemento);
                                },
                                dibujarFondo: () => {
                                    var f = document.createElementNS(SVG_NS, 'rect');
                                    var rconfig = {
                                        cordenadas: {
                                            x: 0,
                                            y: 50
                                        },
                                        atributos: {
                                            radio: {
                                                rx: 20,
                                                ry: 20
                                            },
                                            fondo: 'purple',
                                            borde: 'black',
                                            ancho_borde: 3,
                                            tamaño: {
                                                width: 600,
                                                height: 515
                                            }
                                        }
                                    };
                                    x = 0;
                                    y = 50;
                                    f.setAttribute('x', rconfig.cordenadas.x);
                                    f.setAttribute('y', rconfig.cordenadas.y);
                                    f.setAttribute('width', rconfig.atributos.tamaño.width);
                                    f.setAttribute('height', rconfig.atributos.tamaño.height);
                                    f.setAttribute('rx', rconfig.atributos.radio.rx);
                                    f.setAttribute('ry', rconfig.atributos.radio.ry);
                                    f.style.fill = rconfig.atributos.fondo;
                                    f.style.stroke = rconfig.atributos.borde;
                                    f.style.strokeWidth = rconfig.atributos.ancho_borde;
                                    lienzo.tablero.elementos[lienzo.tablero.elementos.length] = {
                                        tipo: 'fondo',
                                        elemento: f,
                                        configuracion: rconfig
                                    }
                                    svg.appendChild(lienzo.tablero.elementos[lienzo.tablero.elementos.length - 1].elemento);
                                },
                                dibujarTriangulos: () => {
                                    p = document.createElementNS(SVG_NS, 'polygon');
                                    var pconfig = {
                                        puntos: "20" + "," + "20" + " " + "40" + "," + "40" + " " + "0" + "," + "40"
                                    };
                                    p.setAttribute("points", pconfig.puntos);
                                    lienzo.tablero.elementos[lienzo.tablero.elementos.length] = {
                                        tipo: 'triangulo',
                                        elemento: p,
                                        configuracion: pconfig
                                    }
                                    svg.appendChild(lienzo.tablero.elementos[lienzo.tablero.elementos.length - 1].elemento);
                                }
                            }

                            // Iniciar
                            function preparar() {
                                svg = document.getElementById(lienzo.svg.id);
                                configGame(svg, lienzo);
                                acciones.dibujarFondo();
                                acciones.dibujarTriangulos();
                                acciones.iniciarPartida();
                            }

                            function configGame(svg, lienzo) {
                                const $juegos__info_descripcion_titulo = document.getElementById('juegos__info-descripcion-titulo');
                                const $juegos__info_descripcion_texto = document.getElementById('juegos__info-descripcion-texto');
                                const $spanResultado = document.getElementById('spanResultado');
                                const $btnSiguiente = document.getElementById('btnSiguiente');
                                const $juegos__info_puntos = document.getElementById('juegos__info-puntos');
                                const $puntos_jug = document.getElementById('puntos-jug');
                                const $puntos_ia = document.getElementById('puntos-ia');

                                svg.style.width = lienzo.svg.width;
                                svg.style.height = lienzo.svg.height;
                                svg.style.borderRadius = "10px";

                                $juegos__info_descripcion_titulo.innerText = "4 En Raya";
                                $juegos__info_descripcion_texto.innerText = "Juego de 4 en raya contra una IA";
                                $btnSiguiente.innerText = "Siguiente partida";

                                $btnSiguiente.addEventListener('contextmenu', (e) => {
                                    e.preventDefault();
                                    alert("Hola, este es otro secreto del codigo :)");
                                });
                            }

                            // Inicia el juego
                            preparar();
                        },
                        mimundo: (data) => {
                            // Inicio del codigo del juego de: Mundo

                            // Configuración
                            var ventana = {
                                svg: {
                                    id: 'area-juegos',
                                    clases: [
                                        'area-juegos'
                                    ],
                                    width: 600,
                                    height: 200,
                                    html: null,
                                    ns: "http://www.w3.org/2000/svg"
                                    },
                                elementos: []
                            }

                            ventana.svg.html = document.getElementById(ventana.svg.id);

                            const config = {};

                            // Constantes
                            const SVG_NS = ventana.svg.ns;
                            const svg = ventana.svg.html;

                            // Variables

                            // CODIGO GENERAL
                            // Game Scripts
                            const scripts = {
                                main: {
                                    startGame: () => {
                                        const actions = {
                                            createFloor: () => {
                                                const e = document.createElementNS(SVG_NS, 'rect');
                                                const econfig = {
                                                    cord: {
                                                        x: 0,
                                                        y: 150
                                                    },
                                                    size: {
                                                        width: ventana.svg.width,
                                                        height: 49
                                                    },
                                                    styles: {
                                                        fill: 'gray',
                                                        stroke: {
                                                            color: 'black',
                                                            width: 1
                                                        },
                                                        border: {
                                                            radius: '2px'
                                                        }
                                                    }
                                                };
                                                e.setAttribute('x', econfig.cord.x);
                                                e.setAttribute('y', econfig.cord.y);
                                                e.setAttribute('width', econfig.size.width);
                                                e.setAttribute('height', econfig.size.height);
                                                e.setAttribute('rx', econfig.styles.border.radius);
                                                e.setAttribute('ry', econfig.styles.border.radius);
                                                e.style.fill = econfig.styles.fill;
                                                e.style.stroke = econfig.styles.stroke.color;
                                                e.style.strokeWidth = econfig.styles.stroke.width;
                                                ventana.elementos[ventana.elementos.length] = {
                                                    tipo: 'rect',
                                                    id: 'suelo',
                                                    elemento: e,
                                                    config: econfig
                                                }
                                                svg.appendChild(ventana.elementos[ventana.elementos.length - 1].elemento);
                                            },
                                            drawPlayer: () => {
                                                const e = document.createElementNS(SVG_NS, 'circle');
                                                const econfig = {
                                                    cord: {
                                                        cx: 20,
                                                        cy: 137
                                                    },
                                                    size: {
                                                        r: 10
                                                    },
                                                    styles: {
                                                        fill: 'gray',
                                                        stroke: {
                                                            color: 'black',
                                                            width: 1
                                                        }
                                                    }
                                                };
                                                e.setAttribute('cx', econfig.cord.cx);
                                                e.setAttribute('cy', econfig.cord.cy);
                                                e.setAttribute('r', econfig.size.r);
                                                e.style.fill = econfig.styles.fill;
                                                e.style.stroke = econfig.styles.stroke.color;
                                                e.style.strokeWidth = econfig.styles.stroke.width;
                                                ventana.elementos[ventana.elementos.length] = {
                                                    tipo: 'circle',
                                                    id: 'jugador',
                                                    elemento: e,
                                                    config: econfig
                                                }
                                                svg.appendChild(ventana.elementos[ventana.elementos.length - 1].elemento);
                                            },
                                            setObstacles: () => {
                                                const e = document.createElementNS(SVG_NS, 'circle');
                                                var econfig = {
                                                    cord: {
                                                        cx: 500,
                                                        cy: 137
                                                    },
                                                    size: {
                                                        r: 10
                                                    },
                                                    styles: {
                                                        fill: 'gray',
                                                        stroke: {
                                                            color: 'black',
                                                            width: 1
                                                        }
                                                    }
                                                };
                                                e.setAttribute('cx', econfig.cord.cx);
                                                e.setAttribute('cy', econfig.cord.cy);
                                                e.setAttribute('r', econfig.size.r);
                                                e.style.fill = econfig.styles.fill;
                                                e.style.stroke = econfig.styles.stroke.color;
                                                e.style.strokeWidth = econfig.styles.stroke.width;
                                                ventana.elementos[ventana.elementos.length] = {
                                                    tipo: 'circle',
                                                    id: 'enemigo',
                                                    elemento: e,
                                                    config: econfig
                                                }
                                                svg.appendChild(ventana.elementos[ventana.elementos.length - 1].elemento);
                                                setInterval(() => {
                                                    if (econfig.cord.cx < -12) {
                                                        econfig.cord.cx = 612;
                                                        e.setAttribute('cx', econfig.cord.cx);
                                                    } else {
                                                        econfig.cord.cx = econfig.cord.cx - 1;
                                                        e.setAttribute('cx', econfig.cord.cx);
                                                    }
                                                    //econfig.cord.cx = econfig.cord.cx - 1;
                                                    //e.setAttribute('cx', econfig.cord.cx);
                                                }, 1);
                                            }
                                        };
                                        actions.createFloor();
                                        actions.drawPlayer();
                                        actions.setObstacles();
                                    },
                                    configKeys: () => {
                                        const actions = {};
                                    }
                                },
                                player: {
                                    move: () => {
                                        const e = ventana.elementos[1].elemento;
                                        const actions = {
                                            jump: () => {
                                                // for (let i = 137; i > 100; i--) {
                                                //     setTimeout(function () {
                                                //         e.setAttribute('cy', i);
                                                //     }, 750);
                                                // }
                                                e.setAttribute('cy', 100);
                                            },
                                            fall: () => {
                                                e.setAttribute('cy', 137);
                                            }
                                        }
                                        document.addEventListener('keydown', (e) => {
                                            if (e.keyCode == 13) {
                                                actions.jump();
                                            }
                                        });
                                        document.addEventListener('keyup', (e) => {
                                            if (e.keyCode == 13) {
                                                actions.fall();
                                            }
                                        });

                                    }
                                }
                            };

                            // Establecer el codigo que inicia el juego
                            function startGame() {
                                configGame();
                                scripts.main.startGame();
                                scripts.main.configKeys();
                                scripts.player.move();
                            }
                            // Configurar el entorno/web
                            function configGame() {
                                const $juegos__info_descripcion_titulo = document.getElementById('juegos__info-descripcion-titulo');
                                const $juegos__info_descripcion_texto = document.getElementById('juegos__info-descripcion-texto');
                                const $spanResultado = document.getElementById('spanResultado');
                                const $btnSiguiente = document.getElementById('btnSiguiente');
                                const $juegos__info_puntos = document.getElementById('juegos__info-puntos');
                                const $puntos_jug = document.getElementById('puntos-jug');
                                const $puntos_ia = document.getElementById('puntos-ia');

                                svg.style.width = ventana.svg.width;
                                svg.style.height = ventana.svg.height;
                                svg.style.borderRadius = "10px";

                                $juegos__info_descripcion_titulo.innerText = "Mundo 1.0";
                                $juegos__info_descripcion_texto.innerText = "Llega al fin del nivel";
                                $btnSiguiente.innerText = "[Intro] Salto";
                                $juegos__info_puntos.style.display = 'none';

                                $btnSiguiente.addEventListener('contextmenu', (e) => {
                                    e.preventDefault();
                                    alert("Hola, este es otro secreto del codigo :)");
                                });
                            }

                            // Iniciar el juego
                            startGame();
                        }
                    };
                    const listaJuegos = {
                        cuatroenraya: document.getElementById('juego___4enraya'),
                        mimundo: document.getElementById('juego___mundo')
                    }
                    listaJuegos.cuatroenraya.addEventListener('click', (e) => {
                        document.getElementById('juegos').classList.toggle('juegos-activo');
                        juegos.cuatroenraya();
                    });
                    listaJuegos.mimundo.addEventListener('click', (e) => {
                        document.getElementById('juegos').classList.toggle('juegos-activo');
                        juegos.mimundo();
                    });
                    document.getElementById('juegos___cerrar').addEventListener('click', (e) => {
                        document.getElementById('juegos').classList.toggle('juegos-activo');
                    });
                });
            } else {
                $perfil__datos_usuario.innerText = 'Anonimo';
                $perfil__sistema_id.innerText = 'No autorizado';
                $perfil__sistema_version.innerText = 'No autorizado';
                $opciones__general_servidor.innerHTML = 'Desconectado';
                socket.emit('clt:ready', "El servidor ha notificado que el cliente no tiene permiso");
                Swal.fire({
                    icon: 'error',
                    title: 'Oh...',
                    text: 'Ha ocurrido un error!',
                    footer: '<a href>Error x000</a>',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false
                });
            }
        });
    });
}
