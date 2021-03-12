const request = require("request");
const fs = require("fs");
const figlet = require("figlet");
const fetch = require("node-fetch");
const lineReader = require('line-reader');
const proxies = __dirname + "/proxies.txt";
require("colors");
var term = require("terminal-kit").terminal;
var proxyLine = 0;
var proxyUrl = "";
var working = [];
var version = "v1.1"
var toMatch;
// highest rate possible before the stress errors will start to occur
const triesPerSecond = 1;

console.clear();
console.log(figlet.textSync("Nitro Generator").green);
console.log(figlet.textSync("by Epyxx").red);


generatecode = function() {
    let code = "";
    let dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 24; i++) {
        code = code + dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return code;
};
// async for fetch
async function updateLine() {
    proxyLine++;
    var readLine = 0;
    lineReader.eachLine(proxies, function(line, last) {
        readLine++;
        if (readLine === proxyLine) {
            proxyUrl = "http://" + line;
        }
        if (last) {
            // scrape proxies if none are detected
            readLine = 0;
            if (proxyUrl === `http://${line}`) {

                (async() => {
                    term.cyan("Keine Proxy-Server gefunden. Hole neue...\n");
                    await fetch("https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all").then(async res => {
                        const body = (await res.text());
                        fs.writeFileSync(__dirname + "/proxies.txt", body);
                    });
                })();
                proxyLine = 0
            }
        }
    });
}

updateLine();
// requests api checks in order using proxies instead of all at the same time 
// because it would be the exact same waiting time plus more stress with many requests at the same time possibly causing an error
// also changed body requests to no longer parse body data and just use status codes instead
checkCode = function(code) {
    var proxiedRequest = request.defaults({
        'proxy': proxyUrl
    });
    proxiedRequest.timeout = 1500;
    proxiedRequest.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`, (error, resp, body) => {
        if (error) {
            term.brightYellow("Ungültiger Proxy-Server. Wechsle...\n");
            updateLine();
            return;
        }
        try {
            if (resp.statusCode == 200) {
                term.brightGreen(`Dieser Code sollte funktionieren, außer du siehst eine Fehlermeldung! https://discord.gift/${code}\n`);
                console.log(JSON.stringify(body, null, 4));
                working.push(`https://discord.gift/${code}`);
                fs.writeFileSync(__dirname + '/codes.json', JSON.stringify(working, null, 4));
                if (toMatch === 0) {
                    process.exit();
                } else {
                    //console.log("test")
                }
            } else if (resp.statusCode == 429) {
                updateLine();
                term.brightYellow("Proxy Limit erreicht! Wechsle...\n");

            } else {
                term.brightRed(`discord.com/gifts/${code} ist ein ungültiger Code!\n`);
            }
        } catch (error) {
            term.gray("Ein Fehler ist aufgetreten:\n");
            term.gray(error + "\n");
            return;
        }
    });
}
checkCodeOffline = function(code) {
    request(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}?with_application=false&with_subscription_plan=true`, (error, res, body) => {
        if (error) {
            term.gray("Ein Fehler ist aufgetreten:\n");
            term.gray(error + "\n");
            return;
        }
        try {
            if (res.statusCode == 200) {
                term.brightGreen(`Dieser Code sollte funktionieren, außer du siehst eine Fehlermeldung! https://discord.gift/${code}\n`);
                console.log(JSON.stringify(body, null, 4));
                working.push(`https://discord.gift/${code}`);
                fs.writeFileSync(__dirname + '/codes.json', JSON.stringify(working, null, 4));
                if (toMatch === 0) {
                    process.exit();
                } else {
                    //console.log("test")
                }
            } else if (res.statusCode == 429) {
                term.brightYellow("Proxy Limit erreicht!");
            } else {
                term.brightRed(`discord.com/gifts/${code} ist ein ungültiger Code!\n`);

            }
        } catch (error) {
            term.gray("Ein Fehler ist aufgetreten:\n");
            term.gray(error + "\n");
            return;
        }
    });
}


function main() {
    term.brightYellow(
        "Möchtest du den Nitro Generator starten? [Y|N]\n"
    );

    term.yesOrNo({
        yes: ["y", "ENTER"],
        no: ["n"]
    }, function(error, result) {


        if (result) {


            term.brightYellow(
                "Möchtest du Autostop aktivieren? [Y|N]\n"
            );

            term.yesOrNo({
                yes: ["y", "ENTER"],
                no: ["n"]
            }, function(error, result) {
                if (result) {
                    toMatch = 0;

                    term.brightYellow(
                        "Möchtest du Proxy-Server benutzen? [Y|N]\n"
                    );

                    term.yesOrNo({
                        yes: ["y", "ENTER"],
                        no: ["n"]
                    }, function(error, result) {
                        if (result) {



                            term.cyan("Benutze Proxies...\n");

                            var progressBar, progress = 0;


                            function doProgress() {

                                // Add random progress
                                progress += Math.random() / 10;
                                progressBar.update(progress);

                                if (progress >= 1) {

                                    console.clear();
                                    setTimeout(function() {
                                        term.cyan("Benutze Proxies...\n");
                                        term.green("-------------------------------------\n");
                                        term.brightCyan("Made by: Epyx#4545\n");
                                    }, 2000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Falls du Geld für dieses Tool bezahlt hast, wurdest du verarscht :D\n"
                                        );
                                    }, 4000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Es kann sehr lange dauern, bis ein gültiger Code gefunden wurde\n"
                                        );
                                    }, 6000);
                                    setTimeout(function() {
                                        term.brightCyan("Drücke jederzeit 'N' um den Generator zu stoppen\n");
                                    }, 8000);
                                    setTimeout(function() {
                                        term.brightCyan("Viel Spaß :)\n");
                                    }, 10000);

                                    term.green("-------------------------------------\n");
                                    term.green(`Discord Nitro Giftcard Generater ${version} \n`);
                                    term.green(`Prüfe Code alle ${1 / triesPerSecond} Sekunde(n)\n`);

                                    setTimeout(function() {

                                        setInterval(() => {
                                            checkCode(generatecode());
                                        }, (1 / triesPerSecond) * 250);
                                    }, 12000);

                                } else {
                                    setTimeout(doProgress, 100 + Math.random() * 400);
                                }
                            }


                            progressBar = term.progressBar({
                                width: 80,
                                title: "Starte Generator....",
                                eta: true,
                                percent: true
                            });

                            doProgress();



                        } else {
                            term.red("'Nein' erkannt, verwende keine Proxies...\n");


                            var progressBar, progress = 0;


                            function doProgress() {

                                // Add random progress
                                progress += Math.random() / 10;
                                progressBar.update(progress);

                                if (progress >= 1) {

                                    console.clear();
                                    setTimeout(function() {

                                        term.green("-------------------------------------\n");
                                        term.brightCyan("Made by: Epyx#4545\n");
                                    }, 2000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Falls du Geld für dieses Tool bezahlt hast, wurdest du verarscht :D\n"
                                        );
                                    }, 4000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Es kann sehr lange dauern, bis ein gültiger Code gefunden wurde\n"
                                        );
                                    }, 6000);
                                    setTimeout(function() {
                                        term.brightCyan("Drücke jederzeit 'N' um den Generator zu stoppen\n");
                                    }, 8000);
                                    setTimeout(function() {
                                        term.brightCyan("Viel Spaß :)\n");
                                    }, 10000);

                                    term.green("-------------------------------------\n");
                                    term.green(`Discord Nitro Giftcard Generater ${version} \n`);
                                    term.green(`Prüfe Code alle ${12 / triesPerSecond} Sekunde(n)\n`);

                                    setTimeout(function() {

                                        setInterval(() => {
                                            checkCodeOffline(generatecode());
                                        }, (12 / triesPerSecond) * 1000);
                                    }, 12000);

                                } else {
                                    setTimeout(doProgress, 100 + Math.random() * 400);
                                }
                            }


                            progressBar = term.progressBar({
                                width: 80,
                                title: "Starte Generator....",
                                eta: true,
                                percent: true
                            });

                            doProgress();


                        }
                    });


                } else {
                    term.red("'Nein' Der Generator wird kontinuierlich Codes loggen bis er manuell gestoppt wird...\n");

                    term.brightYellow(
                        "Möchtest du Proxy-Server benutzen? [Y|N]\n"
                    );

                    term.yesOrNo({
                        yes: ["y", "ENTER"],
                        no: ["n"]
                    }, function(error, result) {
                        if (result) {



                            term.cyan("Benutze Proxies...\n");

                            var progressBar, progress = 0;


                            function doProgress() {

                                // Add random progress
                                progress += Math.random() / 10;
                                progressBar.update(progress);

                                if (progress >= 1) {

                                    console.clear();
                                    setTimeout(function() {

                                        term.green("-------------------------------------\n");
                                        term.brightCyan("Made by: Epyx#4545\n");
                                    }, 2000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Falls du Geld für dieses Tool bezahlt hast, wurdest du verarscht :D\n"
                                        );
                                    }, 4000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Es kann sehr lange dauern, bis ein gültiger Code gefunden wurde\n"
                                        );
                                    }, 6000);
                                    setTimeout(function() {
                                        term.brightCyan("Drücke jederzeit 'N' um den Generator zu stoppen\n");
                                    }, 8000);
                                    setTimeout(function() {
                                        term.brightCyan("Viel Spaß :)\n");
                                    }, 10000);

                                    term.green("-------------------------------------\n");
                                    term.green(`Discord Nitro Giftcard Generater ${version} \n`);
                                    term.green(`Prüfe Code alle ${1 / triesPerSecond} Sekunde(n)\n`);

                                    setTimeout(function() {

                                        setInterval(() => {
                                            checkCode(generatecode());
                                        }, (1 / triesPerSecond) * 250);
                                    }, 12000);

                                } else {
                                    setTimeout(doProgress, 100 + Math.random() * 400);
                                }
                            }


                            progressBar = term.progressBar({
                                width: 80,
                                title: "Starte Generator....",
                                eta: true,
                                percent: true
                            });

                            doProgress();



                        } else {
                            term.red("'Nein' erkannt, verwende keine Proxies...\n");


                            var progressBar, progress = 0;


                            function doProgress() {

                                // Add random progress
                                progress += Math.random() / 10;
                                progressBar.update(progress);

                                if (progress >= 1) {

                                    console.clear();
                                    setTimeout(function() {

                                        term.green("-------------------------------------\n");
                                        term.brightCyan("Made by: Epyx#4545\n");
                                    }, 2000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Falls du Geld für dieses Tool bezahlt hast, wurdest du verarscht :D\n"
                                        );
                                    }, 4000);
                                    setTimeout(function() {
                                        term.brightCyan(
                                            "Es kann sehr lange dauern, bis ein gültiger Code gefunden wurde\n"
                                        );
                                    }, 6000);
                                    setTimeout(function() {
                                        term.brightCyan("Drücke jederzeit 'N' um den Generator zu stoppen\n");
                                    }, 8000);
                                    setTimeout(function() {
                                        term.brightCyan("Viel Spaß :)\n");
                                    }, 10000);

                                    term.green("-------------------------------------\n");
                                    term.green(`Discord Nitro Giftcard Generater ${version} \n`);
                                    term.green(`Prüfe Code alle ${12 / triesPerSecond} Sekunde(n)\n`);

                                    setTimeout(function() {

                                        setInterval(() => {
                                            checkCodeOffline(generatecode());
                                        }, (12 / triesPerSecond) * 1000);
                                    }, 12000);

                                } else {
                                    setTimeout(doProgress, 100 + Math.random() * 400);
                                }
                            }


                            progressBar = term.progressBar({
                                width: 80,
                                title: "Starte Generator....",
                                eta: true,
                                percent: true
                            });

                            doProgress();


                        }
                    });


                }
            });






        } else {
            term.red("'Nein' erkannt, beende Generator...\n");
            process.exit();
        }
    });
}

main()
process.on('uncaughtException', function(err) {
    term.gray("Ein Fehler ist aufgetreten:\n");
    term.gray(err + "\n");
});


// made by Epyxx
