class App {
    constructor(){
        this.$add = $("#add");
        this.$section = $("section");
        this.$details = $(".details");

        this.$sidebar = $("#sidebar");
        this.$form = $("form");
        this.$titre = $("#titre");
        this.$description = $("#description");
        this.$date_debut = $("#date_debut");
        this.$date_fin = $("#date_fin");

        this.rappels = [];

        this.initPickers();
        this.readRappels();
        this.displayAllRappels();
        this.reinit();
        this.alertsAll();
    };

    reinit(){
        this.$titre.val("");
        this.$description.val("");
        this.$date_debut.val("");
        this.$date_fin.val("");
    }

    initPickers(){
        var options = {
            dayNames : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            dayNamesMin : ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
            monthNames : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            monthNamesShort : ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"],
            firstDay : 1,
            beforeShowDay : $.proxy(this.closedDay, this),
            dateFormat: "dd/mm/yy",
            numberOfMonths : 1
        };

        this.$date_debut.datepicker(options);
        this.$date_fin.datepicker(options);
    };

    addRappel(rappel){
        this.rappels.push(rappel);
    }

    saveRappels(){
        var notesString = JSON.stringify(this.rappels);
        localStorage.setItem("rappels", notesString);
    }

    readRappels(){
        var notesString = localStorage.getItem("rappels");
        var arrayRappels = JSON.parse(notesString);

        for(var rappelObject of arrayRappels){
            var titre = rappelObject.titre;
            var description = rappelObject.description;
            var date_debut = new Date(rappelObject.date_debut);
            var date_fin = new Date(rappelObject.date_fin);
            var rappel = new Rappel(titre, description, date_debut, date_fin);
            this.addRappel(rappel);
        }
    }

    displayAllRappels(){
        for(var rappel of this.rappels){
            rappel.displayRappel();
            this.alerts(rappel);
        }
    }

    alertsAll(){
        var todayDate = new Date();

        for(var rappel of this.rappels){
            if(rappel.date_fin.getTime() + 86400000 < todayDate.getTime()){
                var element = rappel.$dom;
                element.css("background-color", "#ffb3ba");
                // PERIME
            }

            if(rappel.date_debut.getTime() <= (todayDate.getTime() + 259200000) && rappel.date_debut.getTime() > todayDate.getTime()){
                var element = rappel.$dom;
                element.css("background-color", "#bae1ff");

                if(rappel.date_debut.getTime() <= (todayDate.getTime() + 86400000)){
                    alert("ATTENTION ! Il vous reste 1 jour avant \"" + rappel.titre + "\"");
                    var div1 = "<div class='warning'>";
                    div1 += "ATTENTION ! Il vous reste 1 jour avant \"" + rappel.titre + "\"";
                    div1 += "</div>";
                }

                else if(rappel.date_debut.getTime() <= (todayDate.getTime() + 172800000)){
                    alert("ATTENTION ! Il vous reste 2 jours avant \"" + rappel.titre + "\"");
                    var div2 = "<div class='warning'>";
                    div2 += "ATTENTION ! Il vous reste 2 jours avant \"" + rappel.titre + "\"";
                    div2 += "</div>";
                }

                else if(rappel.date_debut.getTime() <= (todayDate.getTime() + 259200000)){
                    alert("ATTENTION ! Il vous reste 3 jours avant \"" + rappel.titre + "\"");
                    var div3 = "<div class='warning'>";
                    div3 += "ATTENTION ! Il vous reste 3 jours avant \"" + rappel.titre + "\"";
                    div3 += "</div>";
                }
                // J-X
            }

            else if(rappel.date_debut.getTime() <= todayDate.getTime() && (rappel.date_fin.getTime() + 86400000) >= todayDate.getTime()){
                var element = rappel.$dom;
                element.css("background-color", "#baffc9");
                alert("Événement aujourd'hui : " + rappel.titre);
                // ACTIF
            }
        }
    }

    alerts(rappel){
        var todayDate = new Date();

        if(rappel.date_fin.getTime() + 86400000 < todayDate.getTime()){
            var element = rappel.$dom;
            element.css("background-color", "#ffb3ba");
            // PERIME
        }

        if(rappel.date_debut.getTime() <= (todayDate.getTime() + 259200000) && rappel.date_debut.getTime() > todayDate.getTime()){
            var element = rappel.$dom;
            element.css("background-color", "#bae1ff");
            // J-X
        }

        if(rappel.date_debut.getTime() <= todayDate.getTime() && (rappel.date_fin.getTime() + 86400000) >= todayDate.getTime()){
            var element = rappel.$dom;
            element.css("background-color", "#baffc9");
            // ACTIF
        }
    }

    deleteRappel(index){
        var rappel = this.rappels[index];
        rappel.destroy();
        this.rappels.splice(index, 1);
    }

    displayExpired(){
        var todayDate = new Date();
        for(var rappel of this.rappels){
            if(rappel.date_fin.getTime() + 86400000 < todayDate.getTime()){
                var element = rappel.$dom;
                rappel.expired = true;
                element.css("background-color", "#ffb3ba");
            }

            else{
                var element = rappel.$dom;
                element.css("display", "none");
            }
        }
    }

    deleteAllExpired(){
        for(var index in this.rappels){
            var rappel = this.rappels[index];

            if(rappel.expired == true){
                rappel.destroy();
                this.rappels.splice(index, 1);
            }
        }
    }
}