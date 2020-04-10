import React, { useState } from "react";
import Parser from "html-react-parser";

export const Table = () => {
    const [title] = useState(document.createElement("h4"));
    const [table, setTable] = useState("");
    const [sources] = useState(document.createElement("div"));
    const [notes] = useState(document.createElement("div"));

    let getData = async () => {
        const corsAnywhere = "https://villa-cors.herokuapp.com/";
        const wikiData = "https://es.wikipedia.org/wiki/Pandemia_de_enfermedad_por_coronavirus_de_2020_en_México";
        await fetch(corsAnywhere+wikiData, { method: "POST" })
            .then(r=>r.text())
            .then(html=>{
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html').querySelector(".wikitable");
                title.innerText = doc.querySelector("caption").innerText;
                doc.querySelector("caption").remove();
                doc.removeAttribute("class");
                doc.querySelectorAll("abbr").forEach(i => {
                    i.replaceWith(i.innerText);
                });
                doc.querySelector("sup").innerText = "[1]";
                doc.querySelectorAll("sup")[1].innerText = "[2]";
                doc.querySelector("tr").classList.add("leyendas");
                doc.querySelectorAll("tr")[1].classList.add("leyendas");
                doc.querySelector(".sortbottom").classList.add("totales");
                doc.querySelector(".sortbottom").classList.remove("sortbottom");
                doc.querySelectorAll(".sortbottom sup").forEach(i => {
                    i.remove();
                });
                doc.querySelectorAll(".mw-cite-backlink").forEach(i => {
                    i.remove();
                });
                sources.classList.add("fuentes-notas");
                sources.innerHTML = `
                    <p>
                        <b>
                            ${doc.querySelector(".sortbottom b").innerText}
                        </b>        
                    </p>
                    <p>
                        <a href="https://www.gob.mx/salud/es/archivo/prensa?idiom=es&order=DESC&page=1">
                            Secretaría de Salud (2020).
                        </a>
                    </p>
                    <p>
                        <a href="http://iigea.com/amag/covid-19/">
                            Instituto de Investigaciones Geológicas y Atmosféricas (2020).
                        </a>
                    </p>
                    <div class="separador">
                `;
                doc.querySelector(".sortbottom").remove();
                notes.classList.add("fuentes-notas");
                notes.innerHTML = `
                    <p>
                        <b>
                            ${doc.querySelector(".sortbottom b").innerText}
                        </b>
                    </p>
                    ${doc.querySelector("ol").outerHTML}
                `;
                doc.querySelector(".sortbottom").remove();
                doc.querySelectorAll("a").forEach(i => {
                    i.replaceWith(i.innerText);
                });
                setTable(doc.outerHTML);
        });
    }
    
    getData();

    return (
        <div>
            {Parser(title.outerHTML)}
            {Parser(table)}
            {Parser(sources.outerHTML)}
            {Parser(notes.outerHTML)}
        </div>
    )
}