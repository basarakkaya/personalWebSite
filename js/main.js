//TODO: fix scroll behavior
//TODO: null check for strings
//line90 (glyphicon-icon)
//line193 (add bullet icons)
//TODO: contact input validation translations

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

function fillNavigation(data, contact, languages, currentLanguage) {
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

    if(languages.length > 1) {
        let languageTogglers = "";

        languages.forEach(language => {
            languageTogglers += '<a class="dropdown-item" href="#" onclick="changeLanguage(' + "'" + language + "'" + ')">' + language.toUpperCase() + '</a>'
        });

        let languageDropdownHTML = 
        '<li class="nav-item dropdown">' +
            '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                currentLanguage.toUpperCase() +
            '</a>' +
            '<div class="dropdown-menu" aria-labelledby="navbarDropdown">' +
                languageTogglers +
            '</div>' +
        '</li>';
        navigationButtonsHTML += languageDropdownHTML;
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
                '<p class="lead" id="brief-title">' + (data.job_title[language] ? data.job_title[language] : data.job_title["en"]) + '</p>' +
                '<hr class="my-4">' +
                '<div id="urls">' +
                    urlsHTML +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';

    $("#jumbotron")[0].innerHTML = jumbotronHTML;
}

function fillContact(data, receiverEmail, token) {
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
                        '<form class="col-12" id="contact-form" onsubmit="sendMail(event, ' + "'" + receiverEmail + "'" + ', ' + "'" + token + "'" + ')">' +
                            '<div class="form-group">' +
                                '<label for="sender-mail-address">' + data.label_sender_mail_address + ' (*)</label>' +
                                '<input type="email" class="form-control" id="sender-mail-address" placeholder="' + data.placeholder_sender_mail_address + '" required>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="sender-full-name">' + data.label_sender_fullname + ' (*)</label>' +
                                '<input type="text" class="form-control" id="sender-full-name" placeholder="' + data.placeholder_sender_fullname + '"required>'  +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="sender-telephone">' + data.label_sender_gsm + '</label>' +
                                '<input type="tel" class="form-control" id="sender-telephone" placeholder="' + data.placeholder_sender_gsm + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="message-body">' + data.label_message_body + ' (*)</label>' +
                                '<textarea class="form-control" id="message-body" rows="3" required></textarea>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="send-a-copy-to-sender">' +
                                    '<label class="form-check-label" for="send-a-copy-to-sender">' + data.label_send_me_a_copy + '</label>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-message" id="form-success">' + data.form_success_text + '</div>' + 
                            '<div class="form-message" id="form-fail">' + data.form_fail_text + '</div>' + 
                            '<button class="btn btn-primary form-button" id="button-send-message" type="submit" >' + data.send_button_text + '</button>' +
                            '<button class="btn btn-primary form-button" id="button-clear-form" onclick="clearContactForm()">' + data.clear_form_button_text + '</button>' +
                        '</form>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</section>';

    $('#sections')[0].innerHTML += contactsHTML;
/* 
    $('#sender-mail-address')[0].oninvalid = function() {
        this.setCustomValidity(data.validity.mail);
    };
    $('#sender-full-name')[0].oninvalid = function() {
        this.setCustomValidity(data.validity.name);
    };
    $('#sender-telephone')[0].oninvalid = function() {
        this.setCustomValidity(data.validity.telephone);
    };
    $('#message-body')[0].oninvalid = function() {
        this.setCustomValidity(data.validity.message);
    }; */
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
                    (bullet.field_bullet_badge_text && bullet.field_bullet_badge_text !== "" ? (' <span class="badge badge-' + (bullet.field_bullet_badge_is_complete ? "secondary" : "primary") + '">' + bullet.field_bullet_badge_text + '</span>') : "") + 
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

    fillNavigation(stringsObj.fields, stringsObj.contact, Object.keys(data.translations), languagePrefix);
    fillJumbotron(data.personal_info, languagePrefix);
    fillSections(stringsObj.fields);
    fillContact(stringsObj.contact, data.personal_info.receiver_mail_address, data.personal_info.smtpjs_secure_token);
}

function changeLanguage(languagePrefix) {
    getInfo(false).then((data) => {
        fillStrings(data, languagePrefix);
    });
}

function clearContactForm() {
    $('#sender-mail-address')[0].value = "";
    $('#sender-full-name')[0].value = "";
    $('#sender-telephone')[0].value = "";
    $('#message-body')[0].value = "";
    $('#send-a-copy-to-sender').prop('checked', false);
}

function sendMail(e, receiverEmail, token) {
    e.preventDefault();

    let messageTo = $('#send-a-copy-to-sender').is(':checked') ?  
        [receiverEmail, $('#sender-mail-address')[0].value] : receiverEmail,
    messageFrom = receiverEmail,
    subject = "Contact Mail From: " + $('#sender-mail-address')[0].value,
    messageBody = 
    "<p>Contact Mail</p>" + 
    "<p>Sender Address: " + $('#sender-mail-address')[0].value + ",</p>" + 
    "<p>Sender Name: " + $('#sender-full-name')[0].value + ",</p>" +
    "<p>Sender Telephone: " + $('#sender-telephone')[0].value + ",</p>" +
    "<p>Message: " + $('#message-body')[0].value + "</p><br />" +
    "<p>Sent at " + new Date() + "</p>";

    Email.send({
        SecureToken : token, //create from smtpjs
        To : messageTo,
        From : messageFrom,
        Subject : subject,
        Body : messageBody
    }).then( function(result) {
        if(result === "OK"){
            $('#form-success').addClass('visible');
            setTimeout(function(){
                $('#form-success').removeClass('visible');
                clearContactForm();
            }, 3000);
        } else {
            $('#form-fail').addClass('visible');
            setTimeout(function(){
                $('#form-fail').removeClass('visible');
            }, 3000);
        }
        console.log("Email result: " + result);
    });
}

window.onload = function(event) {
    let sysLang = window.navigator.language.split('-')[0]; //getting the system language prefix, e.g. "tr" from "tr-TR" or "en" from "en-US"

    getInfo(true).then((data) => {
        localStorage.setItem("translations", JSON.stringify(data));
        fillStrings(data, sysLang);
    });
}