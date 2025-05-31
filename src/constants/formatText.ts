import {t} from "i18next";

export const formatText = (text: string | undefined): string => {
    if (!text) return "<small>Elemento no encontrado, reportar a <a href='mailto:info@breviarium.es?subject=[Reporte] Error de contenido en Breviarium'>info@breviarium.es</a></small>";
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

export const formatPrayers = (text: string | undefined): string => {
    if (!text) return "";
    let textToFormat = text;
    textToFormat = formatItalic(textToFormat, true);
    const paragraphs = textToFormat.split("\n\n").join("<br /><br />");
    return paragraphs.split("\n").join("<br />");
};

export const formatItalic = (text: string, preces = false) => {
    return text.replaceAll(/_(.*?)_/g, preces ? '<br/>&nbsp;&nbsp;<i>$1</i>' : '<i>$1</i>');
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

export const formatTextLecture = (text: string | undefined): string => {
    if (!text) return "<small>Elemento no encontrado, reportar a <a href='mailto:info@breviarium.es?subject=[Reporte] Error de contenido en Breviarium'>info@breviarium.es</a></small>";
    let textToFormat = text;
    if (textToFormat.includes(' R.')) {
        textToFormat = formatBodyOfPsalm(text)
    }
    return textToFormat.split("\n\n").join("<br /><br />")
        .split("C.").join('<span class="title-color">&nbsp&nbspC.</span>')
        .split("S.").join('<span class="title-color">&nbsp&nbspS.</span>')
        .split("+").join('<b><span class="title-color">&nbsp&nbsp+</span></b>')
        .split("\n").join("<br />");
};

export const formatTitleLectures = (title: string) => {
    let titleSplitted = []
    if (title.includes('_')) {
        titleSplitted = title.split('_');
    } else {
        titleSplitted = title.split(':');
    }
    if (isPsalm(title)) {
        return `<ion-text class="title-color">
         <ion-label>${titleSplitted[0].replaceAll(':', '').split('[')[0]} </ion-label> 
         <br /> 
         ℟. ${titleSplitted[1]}
       </ion-text>`
    }
    return `<ion-text class="title-color">
         <ion-label>${titleSplitted[0].replace('\n', '<br />').replace(/(\d):/, "$1").split('[')[0]} • </ion-label> ${titleSplitted[1]}
       </ion-text>`
}

const isPsalm = (title: string): boolean => ['Sal', 'Lectura sálmica'].includes(title.split(' ', 1)[0]);

const formatBodyOfPsalm = (psalm: string): string => {
    return psalm.split(' R.').join('<span class="title-color"> ℟</span>')
}
