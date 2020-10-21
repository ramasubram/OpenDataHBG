const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);
var request = new XMLHttpRequest();
request.open('GET', 'https://helsingborg.opendatasoft.com/api/records/1.0/search/?dataset=smileygodkanda-platser-i-helsingborg&q=', true);
request.onload = function() {
    let data = JSON.parse(this.response);
console.log(data);
    if (request.status >= 200 && request.status < 400)
    {
        data.records.forEach(platser => {
            const plats = document.createElement('div');
            plats.setAttribute('class', 'plats');

            const h2 = document.createElement('h2');
            h2.style.backgroundColor = "GAINSBORO";
            h2.style.color = "blue";

            h2.textContent = platser.fields.kategori_webb;

            const ul = document.createElement('ul');
            const li1 = document.createElement('li');
            const li2 = document.createElement('li');
            li1.textContent = "Namn : " + platser.fields.namn;
            li2.textContent = "Hemsida: " + platser.fields.hemsida;
            
            container.appendChild(plats);
            plats.appendChild(h2);
            plats.appendChild(ul);
            ul.appendChild(li1);
            ul.appendChild(li2);
        });
    }
    else{
        console.log('Fel');
    }

   
}

request.send();