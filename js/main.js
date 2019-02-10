//TODO: languageChange event
//TODO: fix scroll behavior
//TODO: null check for strings
//line47
//line75
//line161

function loadJSON(filePath, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(JSON.parse(xhr.responseText));
		} else {
			if (error)
				error(xhr);
			}
		}
	};
	xhr.open("GET", filePath, false); //synchronous http get request
	xhr.send();
}

function getInfo(forceFetch) {
    return new Promise((resolve, reject) => {
        let jsonPath = "../info.json",
        translations = localStorage.getItem("translations");

        if(translations && forceFetch === false){
            resolve(JSON.parse(translations));
        }
        else {
            loadJSON(jsonPath, (json) => {
                resolve(json);
            }, (error) => {
                window.console.log(error);
                reject(error);
            });
        }
    });
}

function fillNavigation(data, contact) {
    //TODO: Add Navbar Brand Logo and Language Toggle

    let navigationButtonsHTML = "";

    data.forEach(field => {
        let navigationButtonHTML = 
        '<li class="nav-item">' +
            '<a class="nav-link" href="#' + field.field_id + '">' + field.field_title + '</a>' + 
        '</li>';

        navigationButtonsHTML += navigationButtonHTML;
    });

    if(contact) {
        let contactNavigationButtonHTML = 
        '<li class="nav-item">' +
            '<a class="nav-link" href="#' + contact.field_id + '">' + contact.field_title + '</a>' + 
        '</li>';

        navigationButtonsHTML += contactNavigationButtonHTML;
    }

    $("#navbar-ul")[0].innerHTML = navigationButtonsHTML;
}

function fillJumbotron(data, language) {
    let urlsHTML = "", jumbotronHTML = "";
    
    //TODO: Fix the gylphicon-icon issue
    data.social_urls.forEach(url => {
        urlsHTML += ('<a href="' + url.url + '" target="_blank" title="' + url.url_hover_text + '"> ' + (url.icon ? ('<span class="glyphicon glyphicon-' + url.icon + '"></span>') : url.url_hover_text) + '</a>');
    });

    jumbotronHTML = 
    '<div class="container">' +
        '<div class="row">' +
            '<div class="col-md-4 col-sm-12">' +
                '<img id="userphoto" src="' + data.photo_url + '" />' +
            '</div>' +
            '<div class="col-md-8 col-sm-12">' +
                '<h1 class="display-4" id="full-name">' + data.full_name + '</h1>' +
                '<p class="lead" id="brief-title">' + data.job_title[language] + '</p>' +
                '<hr class="my-4">' +
                '<div id="urls">' +
                    urlsHTML +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';

    $("#jumbotron")[0].innerHTML = jumbotronHTML;
}

function fillContact(data) {
    let contactsHTML = 
    '<section id="' + data.field_id + '" class="section">' +
        '<div class="container">' +
            '<div class="row">' +
                '<div class="container">' +
                    '<div class="row area-title">' +
                        '<h4>' + data.field_title + '</h4>' +
                    '</div>' +
                    '<div class="row" id="contact-form">' +
                        '<label>' + data.description + '</label>' +
                        '<form class="col-12">' +
                            '<div class="form-group">' +
                                '<label for="sender-mail-address">' + data.label_sender_mail_address + ' (*)</label>' +
                                '<input type="email" class="form-control" id="sender-mail-address" placeholder="' + data.placeholder_sender_mail_address + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="sender-full-name">' + data.label_sender_fullname + ' (*)</label>' +
                                '<input type="text" class="form-control" id="sender-full-name" placeholder="' + data.placeholder_sender_fullname + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="sender-telephone">' + data.label_sender_gsm + '</label>' +
                                '<input type="tel" class="form-control" id="sender-telephone" placeholder="' + data.placeholder_sender_gsm + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="message-body">' + data.label_message_body + ' (*)</label>' +
                                '<textarea class="form-control" id="message-body" rows="3"></textarea>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="send-a-copy-to-sender">' +
                                    '<label class="form-check-label" for="send-a-copy-to-sender">' + data.label_send_me_a_copy + '</label>' +
                                '</div>' +
                            '</div>' +
                            '<button type="submit" class="btn btn-primary" id="button-send-message">' + data.send_button_text + '</button>' +
                        '</form>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</section>';

    $('#sections')[0].innerHTML += contactsHTML;
}

function fillFieldBulletInfo(bulletInfos){
    let bulletInfosHTML = "";

    if(bulletInfos) {
        bulletInfosHTML += "<ul>";

        bulletInfos.forEach(info => {
            bulletInfosHTML += ('<li>' + info.bullet_info_text + '</li>');
        });

        bulletInfosHTML += "</ul>";
    }

    return bulletInfosHTML;
}

function fillFieldBullets(fieldBullets) {
    //TODO: Add bullet icons
    let bulletsHTML = "";

    if(fieldBullets && fieldBullets.length > 1) {
        bulletsHTML += "<ul>";

        fieldBullets.forEach(bullet => {
            let bulletHTML = 
            '<li>' + 
                bullet.field_bullet_title +
                    (bullet.field_bullet_badge_text && bullet.field_bullet_badge_text !== "" ? (' <span class="badge badge-' + (bullet.field_bullet_badge_is_complete ? "secondary" : "success") + '">' + bullet.field_bullet_badge_text + '</span>') : "") + 
                        fillFieldBulletInfo(bullet.field_bullet_infos) + 
            '</li>';
    
            bulletsHTML += bulletHTML;
        });

        bulletsHTML += "</ul>";
    }
    else {
        if(fieldBullets) {
            bulletsHTML = fieldBullets[0].field_bullet_title + fillFieldBulletInfo(fieldBullets[0].field_bullet_infos);
        }
    }
    
    return bulletsHTML;
}

function fillSections(sections) {
    let sectionsHTML = "";

    sections.forEach(section => {
        let sectionTemplate = 
        '<section id="' + section.field_id + '" class="section">' +
            '<div class="container">' +
                '<div class="row">' +
                    '<div class="container">' +
                        '<div class="row area-title">' +
                            '<h4>' + section.field_title + '</h4>' +
                        '</div>' +
                        '<div class="row">' +
                            fillFieldBullets(section.field_bullets) +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</section>';

        sectionsHTML += sectionTemplate;
    });

    $("#sections")[0].innerHTML = sectionsHTML;
}

function fillStrings(data, languagePrefix) {
    let language = data.translations[languagePrefix] ? languagePrefix : "en",
    stringsObj = data.translations[language];

    fillNavigation(stringsObj.fields, stringsObj.contact);
    fillJumbotron(data.personal_info, languagePrefix);
    fillSections(stringsObj.fields);
    fillContact(stringsObj.contact);
}

function changeLanguage(languagePrefix) {
    getInfo(false).then((data) => {
        fillStrings(data, languagePrefix);
    });
}

window.onload = function(event) {
    let sysLang = window.navigator.language.split('-')[0]; //getting the system language prefix, e.g. "tr" from "tr-TR" or "en" from "en-US"

    getInfo(true).then((data) => {
        localStorage.setItem("translations", JSON.stringify(data));
        fillStrings(data, sysLang);
    });
}