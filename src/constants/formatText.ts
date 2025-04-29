import {t} from "i18next";

export const formatText = (text: string | undefined): string => {
    if (!text) return "<small>Elemento no encontrado, reportar a <a href='mailto:soporte@breviarium.es?subject=[Reporte] Error de contenido en Breviarium'>soporte@breviarium.es</a></small>";
    let textToFormat = text;
    textToFormat = textToFormat.replaceAll(/\$(.*?)\$/g, '<span class="title-color">$1</span>');

    if (textToFormat.includes('$')) {
        textToFormat = format$ToVRRed(text);
    }
    textToFormat = textToFormat.replaceAll("℟.", '<span class="title-color">℟.</span>')
    textToFormat = textToFormat.replaceAll("℣.", '<span class="title-color">℣.</span>')
    textToFormat = textToFormat.replaceAll("o bien este himno, que proviene de la liturgia latina:", '<span class="title-color">o bien este himno, que proviene de la liturgia latina:</span>')

    textToFormat = formatItalic(textToFormat);
    const paragraphs = textToFormat.split("\n\n").join("<br /><br />");
    return paragraphs.split("\n").join("<br />");
};


export const formatItalic = (text: string, preces = false) => {
    return text.replaceAll(/_(.*?)_/g, preces ? '<br/><i>$1</i>' : '<i>$1</i>');
}

const format$ToVRRed = (text: string) => {
    return text.split('$').map(txt => {
        if (txt.includes('℣.') || txt.includes('℟.')
            || txt.includes('Ant') || txt.includes('fórmula')
            || txt.includes('o bien:') || txt.includes('se utiliza el himno de Laudes')
            || txt.includes('o el de Vísperas')
        ) {
            return `<ion-label class="title-color">${txt}</ion-label>`;
        }
        return txt;
    }).join('');
}


export const formatTextIn18__ = (key: string, lang: string | undefined = 'es'): string => {
    const translatedText = t(key, {lng: lang});
    console.log("translatedText", translatedText);
    return formatText(translatedText);
}