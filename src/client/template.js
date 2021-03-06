module.exports = {
  templateHome(wrapper, casa) {
    $('.imoveis__wrapper').eq(wrapper).append(`
            <div class="imovel" data-modal="#imovel" data-id=${casa.idCasa}>
                    <div class="imovel__info">
                        <ul class="imovel__list">
                            <li class="imovel__item">
                                TIPOLOGIA: <span>${casa.tipologia}</span>
                            </li>
                            <li class="imovel__item">
                                WC: <span>${casa.wc} </span>
                            </li>
                            <li class="imovel__item">
                                ZONA: <span>${casa.zona} </span>
                            </li>
                            <li class="imovel__item">
                                MORADA: <span>${casa.morada}</span>
                            </li>
                            <li class="imovel__item">
                                MOBILADO & EQUIPADO: <span>${
                                  casa.mobilado ? 'Sim' : 'Não'
                                }</span>
                            </li>
                            <li class="imovel__item">
                                PRÓXIMO: <span>${casa.proximo}</span>
                            </li>
                            <li class="imovel__item">
                                NET/TV: <span>${
                                  casa.netTv ? 'Sim' : 'Não'
                                }</span>
                            </li>
                            <li class="imovel__item">
                            ${
                              casa.limpezas
                                ? 'LIMPEZAS INCLUÍDAS'
                                : ''
                            }
                            </li>
                            <li class="imovel__item">
                            ${
                              casa.despesas
                                ? 'DESPESAS INCLUÍDAS'
                                : ''
                            }
                            </li>
                        </ul>
                        
                    </div>
                    <img src="/${casa.fotoMain}" alt="Casa">
            </div>
        `);
  },
  templateAdmin(casa) {
    $('.home__exists').append(`
        <form method="post" class="home__form" enctype="multipart/form-data"
        name="home-form" autocorrect="off" autofill=""off data-position="0">
        <div class="home__foto">
            <label for="casa${casa.numero}" class="foto__label">
             <img src="/${casa.fotoMain}" alt="fotoMain">
            </label>
            <input type="file" class="foto__input" name="casa" id="casa${
              casa.numero
            }">
        </div>
        <div class="home__fields">
        <div class="home__numero">
            <input type="hidden" name="numero" value="${
              casa.numero
            }" required readonly>
        </div>
        <div class="home__nome">
            <label>Nome</label>
            <input type="text" name="nome" placeholder="Nome" value="${
              casa.nome
            }" required readonly>
        </div>
        <div class="home__tipologia">
            <label>Tipologia</label>
            <input type="text" name="tipologia" placeholder="Tipologia" value="${
              casa.tipologia
            }" required>
        </div>
        <div class="home__wc">
            <label>WC</label>
            <input type="text" name="wc" placeholder="WC" value="${
              casa.wc
            }" required >
        </div>
        <div class="home__zona">
            <label>Zona</label>
            <input type="text" name="zona" placeholder="Zona" value="${
              casa.zona
            }" required>
        </div>
        <div class="home__morada">
            <label>Morada</label>    
            <input type="text" name="morada" placeholder="Morada" value="${
              casa.morada
            }" required>
        </div>
        <div class="home__proximo">
            <label>Proximo</label>
            <input type="text" name="proximo" placeholder="Próximo" value="${
              casa.proximo
            }" required>
        </div>
        <div class="home__mapa">
            <label>Mapa</label>
            <input type="text" name="mapa" placeholder="Mapa" value="${
              casa.mapa
            }" required>
        </div>
        <div class="home__checkboxes">
            <div class="home__mobilado">
                <label for="mobilado">Mobilado & Equipado:</label>
                <input type="checkbox" name="mobilado" ${
                  casa.mobilado ? 'checked' : 'unchecked'
                }>
            </div>
            <div class="home__netTv">
                <label for="netTv">Net & TV:</label>
                <input type="checkbox" name="netTv" ${
                  casa.netTv ? 'checked' : 'unchecked'
                }>
            </div>
            <div class="home__despesas">
                <label for="despesas">Contas Incluídas:</label>
                <input type="checkbox" name="despesas" ${
                  casa.despesas ? 'checked' : 'unchecked'
                }>
            </div>
            <div class="home__limpezas">
                <label for="limpezas">Limpezas Incl/:</label>
                <input type="checkbox" name="limpezas" ${
                  casa.limpezas ? 'checked' : 'unchecked'
                }>
            </div>
        </div>
        </div>
        <div class="home__buttons">
        <div class="home__edit" data-id="${casa.idCasa}" data-modal="#divisoes">
            <button type="button" >
            <svg>
            <use xlink:href="#edit"></use>
            </svg>
            </button>
        </div>
        <div class="home__submit">
            <button type="submit">
            <svg>
            <use xlink:href="#save"></use>
            </svg>
            </button>
        </div>
        <div class="home__delete">
            <button type="button">
            <svg>
            <use xlink:href="#delete"></use>
            </svg>
            </button>
        </div>
        </div>
    </form>
        `);
  },
  templateQuartos() {}
};
