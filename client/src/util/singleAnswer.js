import React from "react";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Share from "@material-ui/icons/Share";
import TUp from "@material-ui/icons/ThumbUp";
import TDn from "@material-ui/icons/ThumbDown";
import Comment from "@material-ui/icons/Comment";

function SingleAnswer(props) {

    const { classes } = props;
    return(
        <>
            <Divider/>
            <div className={classes.author}>
                <Avatar>A</Avatar>
                <div className={classes.avatarDiv}>
                    <Typography>Hanuman</Typography>
                    <Typography className={classes.time}>10 mins ago</Typography>
                </div>
            </div>
            <Typography varient={"body1"} className={classes.answer}>
                <p>I’m still a student so I don’t earn but my father does. His annual income is somewhat around 60–65 LPA (which was told to me by someone else coz he never mentions his income to us even when asked. If we ask it for some documents or forms, he lies to us saying 20 LPA).</p> <p>Here are some benefits of earning this good amount :-</p> <ol> <li>You have a life of luxury - luxurious cars (we own a Hyundai Elantra though we could have purchased an Audi or BMW because my father wants to maintain a humble lifestyle), luxurious furnishings, quite large bungalow with gardens and porches and attached garage as well as a long drive-way, you have lots of space and need not think before buying a large item as to where to fit it.</li> <li>Shopping whenever you wish to.</li> <li>Having credit cards and Iphone.</li> <li>Foreign trips</li> <li>You can fly on aeroplane without giving much thought to the fares.</li> <li>You have a lot of respect in the society and people are willing to lick-clean your shoes for favours such as promotions, get documents passed by certain politicians etc.</li> <li>You always get the front seat in auditoriums, programs etc.</li> <li>You have many people at hand to help you like 3–4 domestic help, cook, washerman, gardener, etc</li> <li>You have the opportunity to meet powerful and famous people if they visit your city.</li> <li>You can have parties, kitty parties, get-togethers whenever you wish.</li> </ol> <p>But it has negative aspects too :-</p> <ol> <li>Being a child of somewhat wealthy man people have lots of expectations from me. If I don’t do good in any exam, I hear people back-biting me ‘Mr X (say) ki beti unpr nhi gyi… (Mr X’s daughter is not like him), baap ka paisa uda rhi h (wasting her father’s money)…, baap k kamai pe jee rhi h (living on dad’s earnings’. Why don’t they realise that I am a normal human being.</li> <li>The biggest curse you can get in India is belonging to upper caste. No, I am not of upper caste, I am eligible to get OBC certificate but again the back-biting thing.</li> <li>Recently, there was a huge mela (fare) in our neighbourhood on the occasion of Ganesh Puja. All my friends, even those who live far away visited it but I COULD NOT. The reason- my father had inaugrated the fare and has huge respect in the society so how could he share a seat in jhulas (swings) with people belonging to categories of our domestic helps and sweepers? Or how could I stand next to a Panwala (one who sells betel) in a food stall? You can’t have “<strong>Cheap thrills”.</strong></li> <li>I am not allowed to go to my friend’s place or their birthday parties because they live in places where we are not meant to go.</li> <li>If we are in the market place, almost every other person recognizes us. It becomes irritating at times. My cheeks hurt with those constant fake smiles and I have to do a Namaste (Indian way of greeting) each time.</li> <li>I cannot just look bad someday or I cannot keep my house messed up just once in a while.</li> <li>Whenever we go on trips, our main focus is on buying souvenirs for our family and friends again for the fear of tana (sarcastic comments) and char log kya kahenge (what will others say)</li> <li>I have to give a huge birthday party each year which my friends keep craving for. Don’t I have the right to celebrate my special day with family in peace? I escape those parties by planning a trip.</li> <li>My father has to work really hard for earning this amount. Sometimes he returns from work at 10 pm and sometimes he has to go to office even at 2 am. He barely lives in home and sometimes work even on weekends. And the worst part- he is a <strong>mining engineer</strong> (for which we have to live in remote areas and we cannot enjoy city life). Even worse? <strong>He works in underground coal mines.</strong> Normal people cannot even breathe inside there but he has to frequently visit those death holes which are ever-risky. And he has to manage 4 such mine plus a washery.</li> <li>We do not get enough family time. Father is busy at work and mother at those silly parties which she has to forcefully attend. Father also has frequent trips for work.</li> <li>I am bored of that party food. It is so oily and unhealthy. I just cannot eat anymore of those unhygienic, unealthy food.</li> <li>We don’t have many real friends, only 1–2 each. Even distant relatives keep close contact with us only because they want to show-off infront of their circles. Most of the relatives, even my father’s and mother’s brothers and sister’s are jealous of us.</li> <li>My brother and I do not know what economic struggle is. I think that makes us less capable of facing the world. My father clearly mentions that he will not support us financially once we are grown up and are capable of earning money ourselves.</li> <li>My parents have a long story of struggle which makes me keep wondering what would I have done if I were there in their place. I have to work very hard to maintain this lifestyle in future too.</li> <li>Apart from all these, we cannot have little joys of life.</li> <li>In my school, I am the only one who comes and goes back home in a car and that too with a personal driver. This makes me feel bad for my friends. I offer them rides and to drop them but they have self-esteem that does not let them.</li> </ol> <p>PS- I have never assumed myself as rich but when I look at the backgrounds my friends come from, I feel pity, not at them but at myself for I cannot access the joys which they can.</p> <p><strong>Edit: </strong>As mentioned in some comments, I have removed personal details for maintaining privacy. More suggestions are welcome.</p>
            </Typography>
            <div className={classes.flex}   >
                <div className={classes.left}>
                    <Tooltip title="Thumbs Up">
                        <IconButton>
                            <TUp />
                        </IconButton>
                    </Tooltip>
                    <Typography>12</Typography>
                    <Tooltip title="Thumbs Down">
                        <IconButton>
                            <TDn />
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.right}>
                    <IconButton>
                        <Tooltip title="Comment">
                            <Comment />
                        </Tooltip>
                    </IconButton>
                    <IconButton>
                        <Tooltip title="Share">
                            <Share />
                        </Tooltip>
                    </IconButton>
                </div>
            </div>
        </>
    );

}

export default SingleAnswer;
