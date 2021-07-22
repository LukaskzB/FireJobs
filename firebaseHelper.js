import firebase from "./firebase";

class firebaseHelper {

    criarUsuario(dados, success, error) {
        const email = dados.email;
        const senha = dados.senha;
        const nome = dados.nome;
        const tipo = dados.tipo;

        //cria o usuário
        return firebase
            .auth()
            .createUserWithEmailAndPassword(email, senha)
            .then((userData) => {
                let user = userData.user;

                //atualiza o nome do usuário
                user.updateProfile({
                    displayName: nome
                });

                //adiciona o usuário no banco de dados
                firebase.firestore().collection("usuarios").doc(user.uid).set({
                    email: email,
                    nome: nome,
                    tipo: tipo
                });

                //callback de sucesso
                success();

            }).catch(erro => {
                //callback de erro
                console.error(erro);
                error(error(erro));
            });
    }

    fazerLogin(dados, success, error) {
        const email = dados.email;
        const senha = dados.senha;

        firebase.auth().signInWithEmailAndPassword(email, senha).then(() => success()).catch(erro => {
            console.error(erro);

            let codigo = erro.code;
            if (codigo == "auth/user-not-found") {
                error("Não há nenhum usuário com este e-mail! Tente cadastrar-se.");
            } else if (codigo == "auth/invalid-email") {
                error("O e-mail inserido é inválido!");
            } else if (codigo == "auth/wrong-password") {
                error("A senha inserida não está correta!");
            } else {
                error("Ocorreu um erro ao fazer login. Por favor, tente novamente.");
            }
        })
    }

    esqueceuSenha(dados, success, error) {
        let email = dados.email;

        firebase.auth().sendPasswordResetEmail(email).then(() => {
            success("Foi enviado um e-mail de redefinição de senha ao e-mail inserido!");
        }).catch(erro => {
            console.error(erro);

            let codigo = erro.code;
            if (codigo == "auth/user-not-found") {
                error("Não há nenhum usuário com este e-mail! Tente cadastrar-se.");
            } else if (codigo == "auth/invalid-email") {
                error("O e-mail inserido é inválido!");
            } else {
                error("Ocorreu um erro ao enviar o e-mail! Por favor, tente novamente.");
            }
        })
    }

    atualizarPerfil({ nome, tipo }) {
        const user = firebase.auth().currentUser;
        user.updateProfile({ displayName: nome }).catch(erro => { console.log(erro); });;

        return firebase.firestore().collection('usuarios').doc(firebase.auth().currentUser.uid).update({
            nome: nome,
            tipo: tipo
        }).then(() => {
            return "Seu perfil foi atualizado com sucesso! Para que as alterações sejam percebidas, por favor, reinicie o aplicativo!";
        }).catch(erro => {
            console.log(erro);
            return "Ocorreu um erro ao atualizar o seu perfil!";
        });
    }

    getDadosUsuario(success, error) {
        let user = firebase.auth().currentUser;

        if (user == null) { return error(); }

        return firebase.firestore().collection('usuarios').doc(user.uid).get().then(doc => {
            //dados padroes
            let dados = {
                tipo: 'pessoa',
                email: user.email,
                nome: user.displayName
            };

            if (!doc.exists) {
                firebase.firestore().collection('usuarios').doc(user.uid).set(dadosDefault);
            } else {
                dados = doc.data();
            }

            return success(dados);
        }).catch(erro => {
            console.error(erro);
            return error();
        });
    }

    async getVagas() {
        let vagas = [];
        await firebase.firestore().collection('vagas').get().then(query => {
            let i = 0;
            query.docs.forEach(doc => {
                let doc2 = doc.data();
                doc2.id = i;
                doc2.docId = doc.id;
                i += 1;
                vagas.push(doc2);
            })
        })
        return vagas;
    }

    async getFuncionarios() {
        let funcionarios = [];
        await firebase.firestore().collection('funcionarios').get().then(query => {
            let i = 0;
            query.docs.forEach(doc => {
                let doc2 = doc.data();
                doc2.id = i;
                doc2.docId = doc.id;
                i += 1;
                funcionarios.push(doc2);
            })
        })
        return funcionarios;
    }

    adicionarFuncionario({ nomeVaga, contato, periodo, habilidades, escolaridade, localizacao }, success, error) {
        const user = firebase.auth().currentUser;

        if (user == null) { return error("Você precisa estar logado para realizar essa ação!"); }

        let ref = firebase.firestore().collection('funcionarios').doc();

        let localizacao2 = {
            longitude: localizacao.longitude,
            latitude: localizacao.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        };

        let dados = {
            _postadoPorUID: user.uid,
            _postadoPor: user.displayName,
            _pub: firebase.firestore.FieldValue.serverTimestamp(),
            nomeVaga: nomeVaga,
            contato: contato,
            periodo: periodo,
            habilidades: habilidades,
            escolaridade: escolaridade,
            localizacao: localizacao2,
            id: ref.id
        };

        return ref.set(dados).then(() => { return success(); }).catch(erro => {
            console.error(erro);
            return error("Ocorreu um erro ao adicionar seus dados! Por favor, tente novamente.");
        })
    }

    adicionarVaga({ nome, periodo, valor, tipo, contato, descricao, localizacao }, success, error) {
        const user = firebase.auth().currentUser;

        if (user == null) { return error("Você precisa estar logado para realizar essa ação!"); }

        let ref = firebase.firestore().collection('vagas').doc();

        let localizacao2 = {
            longitude: localizacao.longitude,
            latitude: localizacao.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        };

        let dados = {
            _postadoPorUID: user.uid,
            _postadoPor: user.displayName,
            _pub: firebase.firestore.FieldValue.serverTimestamp(),
            nome: nome,
            periodo: periodo,
            valor: valor,
            tipo: tipo,
            contato: contato,
            descricao: descricao,
            localizacao: localizacao2,
            id: ref.id
        };

        return ref.set(dados).then(() => { return success(); }).catch(erro => {
            console.error(erro);
            return error("Ocorreu um erro ao adicionar sua vaga! Por favor, tente novamente.");
        });
    }

    removerVaga({ id }, success, error) {

        const user = firebase.auth().currentUser;
        if (user == null) { return error("Você precisa estar logado para realizar essa ação!"); }

        return firebase.firestore().collection('vagas').doc(id).delete().then(() => {
            return success();
        }).catch(erro => {
            console.log(erro);
            return error("Ocorreu um erro ao excluir a vaga! Por favor, tente novamente.");
        })
    }

    removerFuncionario({ id }, success, error) {

        const user = firebase.auth().currentUser;
        if (user == null) { return error("Você precisa estar logado para realizar essa ação!"); }

        return firebase.firestore().collection('funcionarios').doc(id).delete().then(() => {
            return success();
        }).catch(erro => {
            console.log(erro);
            return error("Ocorreu um erro ao excluir os dados! Por favor, tente novamente.");
        })
    }

    editarVaga({ id, nome, periodo, valor, tipo, contato, descricao, localizacao }, success, error) {

        const user = firebase.auth().currentUser;
        if (user == null) { return error("Você precisa estar logado para realizar essa ação!"); }

        let ref = firebase.firestore().collection('vagas').doc(id);

        let dados = {
            nome: nome,
            periodo: periodo,
            valor: valor,
            tipo: tipo,
            contato: contato,
            descricao: descricao,
            localizacao: localizacao
        };

        return ref.update(dados).then(() => {
            return success();
        }).catch(erro => {
            console.log(erro);
            return error("Ocorreu um erro ao editar a vaga! Por favor, tente novamente.");
        })
    }

    editarFuncionario({ id, nomeVaga, contato, periodo, habilidades, escolaridade, localizacao }, success, error) {

        const user = firebase.auth().currentUser;
        if (user == null) { return error("Você precisa estar logado para realizar essa ação!"); }

        let ref = firebase.firestore().collection('funcionarios').doc(id);

        let dados = {
            nomeVaga: nomeVaga,
            contato: contato,
            periodo: periodo,
            habilidades: habilidades,
            escolaridade: escolaridade,
            localizacao: localizacao
        };

        return ref.update(dados).then(() => {
            return success();
        }).catch(erro => {
            console.log(erro);
            return error("Ocorreu um erro ao editar os dados! Por favor, tente novamente.");
        });
    }
}

const FirebaseHelper = new firebaseHelper();
export default FirebaseHelper;