import React, { useState } from "react";
import Parser from "html-react-parser";
import ReactSpinner from "react-loader-spinner";

export const Table = () => {
    const [title] = useState(document.createElement("h4"));
    const [table, setTable] = useState("");
    const [sources] = useState(document.createElement("div"));
    const [notes] = useState(document.createElement("div"));
    const loading = <ReactSpinner 
                        type="Oval"
                        color="#888888"
                        height={100}
                        width={100}
                        visible={true}
                    />;

    let getData = async () => {
        const corsAnywhere = "https://villa-cors.herokuapp.com/";
        const localCors = "http://localhost:3001/";
        const wikiData = "https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_Mexico";
        await fetch(localCors+wikiData)
            .then(r=>r.text())
            .then(html=>{
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html').querySelector(".wikitable");
                title.innerText = "Casos de COVID-19 por entidad federativa en México"
                doc.querySelector("caption").remove();
                doc.removeAttribute("class");
                doc.querySelector("tr").classList.add("leyendas");
                doc.querySelectorAll("tr")[1].classList.add("totales");
                doc.querySelectorAll(".totales > th").forEach(i => {
                    i.removeAttribute("style");
                    i.classList.add("totales");
                });
                doc.querySelectorAll("img").forEach(i => {
                    i.remove();
                });
                doc.querySelectorAll(".flagicon").forEach(i => {
                    i.remove();
                });
                doc.querySelectorAll(".leyendas > th")[0].innerText = "Estado";
                doc.querySelectorAll(".leyendas > th")[1].innerText = "Casos";
                doc.querySelectorAll(".leyendas > th")[2].innerText = "Fallecidos";
                doc.querySelectorAll(".leyendas > th")[3].innerText = "Recuperados";
                for (let i = 2; i <= 33; i++) {
                    doc.querySelectorAll("tr")[i].querySelector("th").setAttribute("style", "text-align: right");
                    if (doc.querySelectorAll("tr")[i].querySelector("th").innerText.search("Mexico City") !== -1) {
                        doc.querySelectorAll("tr")[i].querySelector("th").innerText = "Ciudad de México";
                    } else if (doc.querySelectorAll("tr")[i].querySelector("th").innerText.search("State of Mexico") !== -1) {
                        doc.querySelectorAll("tr")[i].querySelector("th").innerText = "Estado de México";
                    }
                }
                doc.querySelector(".sortbottom").remove();
                sources.classList.add("fuentes-notas");
                sources.innerHTML = `
                    <p>
                        <b>
                           Fuentes: 
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
                `;
                doc.querySelectorAll("a").forEach(i => {
                    i.replaceWith(i.innerText);
                });
                setTable(doc.outerHTML);
        });
    }
    
    getData();

    return (
        <div>
            {table!==""?Parser(title.outerHTML):loading}
            {table!==""?Parser(table):""}
            {table!==""?Parser(sources.outerHTML):""}
            {table!==""?Parser(notes.outerHTML):""}
        </div>
    )
}