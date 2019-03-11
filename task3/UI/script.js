;(function() {
    var photoPosts = [
        {
            id: '1',
            description: 'Love is love',
            creationDate: new Date('2019-03-06T23:00:00'),
            author: 'Petr Ivanov',
            photoLink: 'http://',
            hashTags: ['auto'],
            likes: []
        },
        {
            id: '2',
            description: 'Life is life',
            creationDate: new Date('2019-03-07T23:30:00'),
            author: 'Grishanya',
            photoLink: 'http://life',
            hashTags: [],
            likes: []
        },
        {
            id: '3',
            description: 'Look at that!!!',
            creationDate: new Date('2019-03-06T23:00:00'),
            author: 'Ivan',
            photoLink: 'http://look',
            hashTags: ['motobike'],
            likes: []
        },
        {
            id: '4',
            description: 'Pam pam pam',
            creationDate: new Date('2019-03-06T23:00:00'),
            author: 'Ganna',
            photoLink: 'http://ganna',
            hashTags: ['qqqwwweeerrrtttyyyuo'],
            likes: []
        },
        {
            id: '5',
            description: 'My favorite car',
            creationDate: new Date('2019-03-07T23:00:00'),
            author: 'Lexa',
            photoLink: 'http://lexa',
            hashTags: [],
            likes: []
        },
        {
            id: '6',
            description: 'Hi, my dear friends',
            creationDate: new Date(),
            author: 'Chelik',
            photoLink: 'http://chelik',
            hashTags: [],
            likes: []
        },
        {
            id: '7',
            description: 'Hello, my dear dad',
            creationDate: new Date('2018-03-06T23:00:00'),
            author: 'Chel',
            photoLink: 'http://chel',
            hashTags: [],
            likes: []
        },
        {
            id: '8',
            description: 'car house honor',
            creationDate: new Date(),
            author: 'molly',
            photoLink: 'http://molly',
            hashTags: [],
            likes: []
        },
        {
            id: '9',
            description: 'its my home',
            creationDate: new Date('2019-03-07T23:00:00'),
            author: 'valya',
            photoLink: 'http://valya',
            hashTags: [],
            likes: []
        },
        {
            id: '10',
            description: 'sport sport sport!!!',
            creationDate: new Date(),
            author: 'serega',
            photoLink: 'http://serega',
            hashTags: [],
            likes: []
        },
        {
            id: '11',
            description: 'I love you',
            creationDate: new Date(),
            author: 'Kris',
            photoLink: 'http://kris',
            hashTags: [],
            likes: []
        },
        {
            id: '12',
            description: 'thanks for day',
            creationDate: new Date(),
            author: 'katya',
            photoLink: 'http://katya',
            hashTags: [],
            likes: []
        },
        {
            id: '13',
            description: 'pam param pam pam',
            creationDate: new Date(),
            author: 'mac',
            photoLink: 'http://mac',
            hashTags: [],
            likes: []
        },
        {
            id: '14',
            description: 'fanny moment',
            creationDate: new Date(),
            author: 'alex',
            photoLink: 'http://alex',
            hashTags: [],
            likes: []
        },
        {
            id: '15',
            description: 'animals are wonderful',
            creationDate: new Date(),
            author: 'felya',
            photoLink: 'http://felya',
            hashTags: [],
            likes: []
        },
        {
            id: '16',
            description: 'lovely boy',
            creationDate: new Date(),
            author: 'max',
            photoLink: 'http://max',
            hashTags: [],
            likes: []
        },
        {
            id: '17',
            description: 'kimi no Na wa',
            creationDate: new Date('2019-03-07'),
            author: 'Sparkle',
            photoLink: 'http://Sparkle',
            hashTags: [],
            likes: []
        },
        {
            id: '18',
            description: 'love me like you do',
            creationDate: new Date('2019-03-08'),
            author: 'Ellie',
            photoLink: 'http://ellie',
            hashTags: [],
            likes: []
        },
        {
            id: '19',
            description: 'Hey, soul sister',
            creationDate: new Date(),
            author: 'Train',
            photoLink: 'http://train',
            hashTags: [],
            likes: []
        },
        {
            id: '20',
            description: 'wake me up in the sky',
            creationDate: new Date(),
            author: 'Gucci',
            photoLink: 'http://Gucci',
            hashTags: ['avia'],
            likes: []
        }

    ];
    function sortDownByDate(a,b) {
        return b['creationDate']-a['creationDate'];
    }
	return{
		addPhotoPost: function(post){
			if (this.validatePhotoPost(post)) {
            photoPosts.push(post);
            console.log('Successfully added');
            return true;
        }
		console.log('Add error. Failed validation')
        return false;
		},
		getPhotoPost: function(id){
			return photoPosts.filter((value) => {return value['id'] === id;
    })[0];
		},
		deletePhotoPost: function(id){
		var tmp = this.getPhotoPost(id);
        if (typeof tmp === 'undefined' || tmp === null || tmp.length === 0) {
            console.log('Object with current id does not exist');
            return false;
        }
        photoPosts.splice(photoPosts.indexOf(tmp),1);
        console.log('Successfully deleted');
        return true;
		},
		editPhotoPost: function(id, post){
		var tmp = this.getPhotoPost(id);
        if (typeof tmp === 'undefined' || tmp === null || tmp.length === 0) {
            console.log('An object with current id doesnt exist');
            return false;
        }
        var objectToEdit = {};
        for(item in tmp){
            objectToEdit[item] = tmp[item];
        }
        for (field in post) {
            if(objectToEdit[field] === undefined){
                console.log('photoPost doesnt contain field <{}>'.replace('{}',field));
                console.log('Error while editing');
                return false;
            }
            switch (field) {
                case 'author':
                case 'creationDate':
                case 'id': {
                    console.log('Any changes to field <{}> will not be apllied'.replace('{}', field));
                    break;
                }
                case 'description':
                case 'hashTags':
                case 'likes':
                case 'photoLink': {
                    objectToEdit[field] = post[field];
                    break;
                }
            }
        }
        if (this.validatePhotoPost(objectToEdit, true)) {
            var index = photoPosts.indexOf(tmp);
            photoPosts.splice(index, 1, objectToEdit);
            console.log('Successfully edited');
            return true;
        } else {
            console.log('Error while editing');
            return false;
        }
		},
		validatePhotoPost: function(photoPost, afterEdit=false){
			if(Object.prototype.toString.call(photoPost) === '[object Object]'){
				if(!afterEdit){
				var reqFields = ['id','description','creationDate','author','photoLink','hashTags','likes'];
				var count = 0;
				for(field in photoPost){
					if(reqFields.indexOf(field) !== -1){
						count+=1;
					}
				}
				if(count!== reqFields.length){
					console.log('An object doesnt contain all requared fields');
					return false;
				}
				photoPost['likes'] = [];
			}
			for (field in photoPost) {
            switch (field) {
                case 'id': {
                    if (!(typeof photoPost[field] === 'string') || isNaN(+photoPost[field])){
                        console.log('The format of id is wrong');
                        return false;
                    }
                    if (!afterEdit) {
                        var objects = photoPosts.filter(function (item) {
                            return item['id'] === photoPost[field];
                        });
                        if (objects.length !== 0){
                            console.log('An object with current id already exists');
                            return false;
                        }
                    }
                    break;
                }
                case 'description': {
                    if (typeof (photoPost[field]) === 'string') {
                        if (photoPost[field].trim().length < 10 || photoPost[field].trim().length > 200) {
                            console.log('The length of description is wrong');
                            return false;
                        }
                    } else {
                        console.log('The format of description is wrong');
                        return false;
                    }
                    break;
                }
                case 'dateFrom':
                case 'dateTo':
                case 'creationDate': {
                    if (Object.prototype.toString.call(photoPost[field]) === '[object Date]') {
                        break;
                    }
                    if (new Date(photoPost[field]) === 'Invalid Date' || photoPost[field] === null){
                        console.log('Impossible to convert to date');
                        return false;
                    }
                    if (isNaN(+photoPost[field])) {
                        photoPost[field] = new Date(photoPost[field]);
                    } else {
                        console.log('The format of Date is wrong');
                        return false;
                    }
                    break;
                }
                case 'author': {
                    if (typeof photoPost[field] !== 'string' || photoPost[field].length === 0) {
                        console.log('The format of field \"author\" is wrong');
                        return false;
                    }
                    break;
                }
                case 'photoLink': {
                    if (typeof photoPost[field] !== 'string' || photoPost[field].length === 0){
                        console.log('The format of field \"photoLink\" is wrong');
                        return false;
                    }
                    break;
                }
                case 'hashTags': {
                    if (Array.isArray(photoPost[field])) {
                        if (!photoPost[field].includes(null) && !photoPost[field].includes(undefined) && !photoPost[field].includes('')) {
                            var tags = photoPost[field].filter(function (item) {
                                return item.length > 20;
                            });
                            if (tags.length !== 0) {
                                console.log('The length of each tag should be less than 20');
                                return false;
                            }
                        } else {
                            console.log('The format of field \"hashTags\" is wrong. It must contains only strings(length > 0)');
                            return false;
                        }
                    }
                    else {
                        console.log('The format of field \"hashTags\" is wrong. It should be an array');
                        return false;
                    }
                    break;
                }
                case 'likes': {
                    if (Array.isArray(photoPost[field])) {
                        if (photoPost[field].includes(null) || photoPost[field].includes(undefined) || photoPost[field].includes('')) {
                            console.log('The format of field \"Likes\" is wrong. It must contains only strings(length > 0)');
                            return false;
                        }
                    }
                    else{
                        console.log('The format of field \"Likes\" is wrong. It should be an array');
                        return false;
                    }
                    break;
                }
            }
        }
        return true;
			}
			else{
				console.log('photoPost must be an Object');
				return false;
			}
			
			
		},
        getPhotoPosts: function(skip=0, get=10,filterConfig=undefined){
			if (typeof skip !== 'number' || typeof get !== 'number'){
				console.log('Error of type. Skip and get must be numbers')
				return [];
			}
            if(typeof filterConfig ==='undefined'){
                return photoPosts.slice(skip, skip+get).sort(sortDownByDate);
            }
            if (Object.prototype.toString.call(filterConfig) === '[object Object]') {
                if(this.validatePhotoPost(filterConfig,true)){
                    var arrayObjects = [];
                    var object = {
                        dateFrom: null,
                        dateTo: null,
                        author: null,
                        hashTags: null
                    };
                    for (key in filterConfig) {
                        if (object[key] !== undefined){
                            object[key]=filterConfig[key];
                        }
                        else{
                            console.log('The format of filter\'s field is wrong');
                            return [];
                        }
                    }
                    var firstSize = 0;
                    var secondSize = 0;
                    var tmpArr =[];
                    var tags = [];
                    for (key in object) {
                        if(object[key] !== null){
                            if (arrayObjects.length === 0){
                                firstSize = arrayObjects.length;
                                switch (key) {
                                    case 'dateFrom':{
                                        arrayObjects = arrayObjects.concat(photoPosts.filter((value) => {return value['creationDate'] >= object[key]}));
                                        break;
                                    }
                                    case 'dateTo':{
                                        arrayObjects = arrayObjects.concat(photoPosts.filter((value) => {return value['creationDate'] <= object[key]}));
                                        break;
                                    }
                                    case 'author':{
                                        arrayObjects = arrayObjects.concat(photoPosts.filter((value) => {return value['author'].trim().toLowerCase().indexOf(object[key].trim().toLowerCase()) !== -1}));
                                        break;
                                    }
                                    case 'hashTags':{
                                        if(object[key].length!==0){
                                            firstSize = arrayObjects.length;
                                            for(i=0;i < photoPosts.length;i++) {
                                                tags = photoPosts[i]['hashTags'];
                                                for (j = 0; j < tags.length; j++) {
                                                    for (k = 0; k < object[key].length; k++) {
                                                        try {
                                                            if (tags[j].trim().toLowerCase().indexOf(object[key][k].trim().toLowerCase()) !== -1) {
                                                                tmpArr.push(object[key][k]);
                                                            }
                                                        } catch (e) {
                                                            console.log(e.message);
                                                            return [];
                                                        }
                                                    }
                                                }
                                                if (tmpArr.length !== 0) {
                                                    arrayObjects.push(photoPosts[i]);
                                                }
                                                tmpArr.splice(0, tmpArr.length);
                                            }
                                        }
                                        else{
                                            arrayObjects = arrayObjects.concat(photoPosts);
                                        }
                                        break;
                                    }
                                }
                                secondSize = arrayObjects.length;
                                if(firstSize===secondSize){
                                    console.log('Nothing found');
                                    return [];
                                }
                            }
                            else{
                                switch (key) {
                                    case 'dateFrom':{
                                        arrayObjects = arrayObjects.filter((value) => {return value['creationDate'] >= object[key]});
                                        break;
                                    }
                                    case 'dateTo':{
                                        arrayObjects = arrayObjects.filter((value) => {return value['creationDate'] <= object[key]});
                                        break;
                                    }
                                    case 'author':{
                                        arrayObjects = arrayObjects.filter((value) => {return value['author'].trim().toLowerCase().indexOf(object[key].trim().toLowerCase()) !== -1});
                                        break;
                                    }
                                    case 'hashTags':{
                                        if (object[key].length !== 0) {
                                            for (var i = 0; i < arrayObjects.length; i++) {
                                                tags = arrayObjects[i]['hashTags'];
                                                for (var j = 0; j < tags.length; j++) {
                                                    for (var k = 0; k < object[key].length; k++) {
                                                        try {
                                                            if (tags[j].trim().toLowerCase().indexOf(object[key][k].trim().toLowerCase()) !== -1) {
                                                                tmpArr.push(object[key][k]);
                                                            }
                                                        } catch (e) {
                                                            console.log(e.message);
                                                            return [];
                                                        }
                                                    }
                                                }
                                                if (tmpArr.length === 0) {
                                                    arrayObjects.splice(arrayObjects.indexOf(arrayObjects[i]), 1);
                                                    i--;
                                                }
                                                tmpArr.splice(0, tmpArr.length);
                                            }
                                        }
                                        break;
                                    }
                                }
                                if (arrayObjects.length === 0) {
                                    console.log('Nothing found');
                                    return [];
                                }
                            }
                        }
                    }
                    return arrayObjects.slice(skip,skip+get).sort(sortDownByDate);
                }
                else{
                    console.log('The formatConfig is wrong');
                    return [];
                }
            }
			else{
				console.log('Error type of filter');
				return [];
			}
			
        }
	}
}());
