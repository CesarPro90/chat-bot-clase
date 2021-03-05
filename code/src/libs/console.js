const chalk = require('chalk');

module.exports = (area, txt, color) => {
    const c = require('chalk');
    const tmp_msg = new Array();
    const format_area = (area_name, color) => {
        return c.bold(c.keyword(color)('[' + c.underline(area_name) + ']'));
    };
    switch (area) {
        case 'server':
            tmp_msg[0] = format_area('Servidor', 'blue');
            break;
        case 'client':
            tmp_msg[0] = format_area('Cliente', 'green');
            break;
    }
    const sep_txt = txt.split(':') || '>> Mensaje no definido en el codigo!';
    const alt_colors = (c) => {
        var def_colors = '';
        for (let i = 0; i < c.length - 1; i++) {
            def_colors += 'white,';
        }
        def_colors += 'white';
        return def_colors;
    };
    if (color.includes(' ')) {
        console.log('>> El siguiente mensaje se va a escribir mal porque el codigo tiene un error');
    }
    var colors = color || alt_colors(sep_txt);
    colors = colors.split(',');
    if (colors.length !== sep_txt.length) {
        colors = alt_colors(sep_txt);
        colors = colors.split(',');
    }
    var def_txt = new Array();
    const set_colortxt = (cc, ct) => {
        return c.keyword(cc)(ct);
    };
    for (let i = 0; i < sep_txt.length; i++) {
        const ac = colors[i];
        const at = sep_txt[i];
        switch (ac) {
            case 'red':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'orange':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'yellow':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'green':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'blue':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'cyan':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'purple':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'white':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'gray':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'black':
                def_txt[i] = set_colortxt(ac, at);
                break;
            case 'magenta':
                def_txt[i] = set_colortxt(ac, at);
                break;
                                    
        }
    }
    var return_txt = tmp_msg + ' ';
    for (let i = 0; i < def_txt.length; i++) {
        return_txt += def_txt[i];
    }
    console.log(return_txt);
}